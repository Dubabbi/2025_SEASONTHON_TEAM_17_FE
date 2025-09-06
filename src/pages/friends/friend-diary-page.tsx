import { diariesApi } from '@apis/diaries/diaries';
import { diariesQueries } from '@apis/diaries/diaries-queries';
import ThinkIcon from '@assets/icons/thinking.svg?react';
import DiaryCard from '@components/card/diary-card';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { EmotionId, ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import { DIARY_EMOTIONS } from '@pages/diary/constants/diary-emotions';
import { emotionLikeStore, useEmotionLikesVersion } from '@pages/diary/stores/emotion-like-store';
import { type DetailVM, toDetailVM } from '@pages/friends/utils/to-detail-vm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

function isListEmptyPayload(raw: unknown) {
  const d = isObj(raw) && 'data' in raw ? ((raw as { data?: unknown }).data ?? raw) : raw;
  if (Array.isArray(d)) return d.length === 0;
  const d1 = isObj(d) ? (d as Record<string, unknown>).data : undefined;
  if (Array.isArray(d1)) return d1.length === 0;
  const d2 = isObj(d1) ? (d1 as Record<string, unknown>).data : undefined;
  if (Array.isArray(d2)) return d2.length === 0;
  return false;
}

type EmotionDTO = { id: number; type: EmotionId; likeCount: number };

const isEmotionId = (v: unknown): v is EmotionId =>
  typeof v === 'string' && DIARY_EMOTIONS.some((e) => e.id === v);

export default function FriendDiaryPage() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const idNum = Number(diaryId);
  const enabled = Number.isFinite(idNum);
  const qc = useQueryClient();
  const likesVer = useEmotionLikesVersion();

  const detailQ = useQuery({ ...diariesQueries.detail(idNum), enabled });

  const vm: DetailVM | null = useMemo(() => toDetailVM(detailQ.data), [detailQ.data]);

  const root = useMemo(() => {
    const r =
      isObj(detailQ.data) && 'data' in detailQ.data
        ? (detailQ.data as Record<string, unknown>).data
        : detailQ.data;
    return r ?? null;
  }, [detailQ.data]);

  const dateObj = useMemo(() => {
    if (vm?.createdAt) {
      const d = dayjs(vm.createdAt);
      return d.isValid() ? d.toDate() : new Date(vm.createdAt);
    }
    return new Date();
  }, [vm?.createdAt]);

  const isEmpty = !enabled || isListEmptyPayload(detailQ.data) || !vm;

  const emotionDtos: EmotionDTO[] = useMemo(() => {
    const arr = (root?.emotions ?? []) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr
      .map((e) => {
        const id = Number((e as Record<string, unknown>)?.emotionId);
        const typeRaw = (e as Record<string, unknown>)?.type;
        const likeCount = Number((e as Record<string, unknown>)?.likeCount ?? 0);
        return Number.isFinite(id) && isEmotionId(typeRaw)
          ? ({ id, type: typeRaw, likeCount } as EmotionDTO)
          : null;
      })
      .filter((e): e is EmotionDTO => e !== null);
  }, [root?.emotions]);

  const initialCounts = useMemo<ReactionCounts>(() => {
    return emotionDtos.reduce<ReactionCounts>((acc, e) => {
      acc[e.type] = e.likeCount;
      return acc;
    }, {} as ReactionCounts);
  }, [emotionDtos]);

  const emotionIdByType = useMemo<Record<EmotionId, number | undefined>>(() => {
    const map = {} as Record<EmotionId, number | undefined>;
    emotionDtos.forEach((e) => {
      map[e.type] = e.id;
    });
    return map;
  }, [emotionDtos]);

  const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
  const [myToggles, setMyToggles] = useState<Set<EmotionId>>(new Set());

  useEffect(() => {
    const set = new Set<EmotionId>();
    for (const e of emotionDtos) {
      if (emotionLikeStore.isLiked(e.id)) {
        set.add(e.type);
        break;
      }
    }
    setMyToggles(set);
  }, [emotionDtos]);

  useEffect(() => {
    setCounts(initialCounts);
  }, [initialCounts]);

  const order = useMemo<EmotionId[]>(() => emotionDtos.map((e) => e.type), [emotionDtos]);

  const currentSelectedType = useMemo<EmotionId | undefined>(() => {
    void likesVer;
    for (const e of emotionDtos) {
      if (emotionLikeStore.isLiked(e.id)) return e.type;
    }
    for (const t of myToggles) return t;
    return undefined;
  }, [emotionDtos, myToggles, likesVer]);

  const handleToggle = useCallback(
    async (id: EmotionId) => {
      const nextId = emotionIdByType[id];
      if (!nextId) return;

      const prevType = currentSelectedType;
      const same = prevType === id;
      const prevEmotionId = prevType ? emotionIdByType[prevType] : undefined;

      const prevLiked = prevEmotionId ? emotionLikeStore.isLiked(prevEmotionId) : false;
      const nextLiked = emotionLikeStore.isLiked(nextId);

      if (prevEmotionId && prevLiked) emotionLikeStore.setLiked(prevEmotionId, false);
      if (!same && !nextLiked) emotionLikeStore.setLiked(nextId, true);

      if (prevType) {
        setCounts((p) => {
          const n = { ...p };
          const cur = n[prevType] ?? 0;
          n[prevType] = Math.max(0, cur - 1);
          return n;
        });
      }
      if (!same) {
        setCounts((p) => {
          const n = { ...p };
          const cur = n[id] ?? 0;
          n[id] = Math.max(0, cur + 1);
          return n;
        });
      }

      setMyToggles(() => {
        const s = new Set<EmotionId>();
        if (!same) s.add(id);
        return s;
      });

      try {
        if (prevEmotionId && prevLiked) await diariesApi.likeEmotion(prevEmotionId);
        if (!same && !nextLiked) await diariesApi.likeEmotion(nextId);
      } catch {
        if (prevEmotionId) emotionLikeStore.setLiked(prevEmotionId, prevLiked);
        emotionLikeStore.setLiked(nextId, nextLiked);
        setCounts(initialCounts);
        qc.invalidateQueries({ queryKey: diariesQueries.detail(idNum).queryKey });
      }
    },
    [emotionIdByType, currentSelectedType, initialCounts, qc, idNum],
  );

  return (
    <div className="min-h-dvh flex-col gap-[2rem] px-[2.4rem] pt-[2rem] pb-[16rem]">
      <div className="flex-col gap-[1.2rem]">
        {isEmpty ? (
          <div className="flex-col-center gap-[2rem] py-[2.6rem]">
            <ThinkIcon className="h-[6.4rem] w-[6.4rem]" />
            <span className="heading3-700 pt-[3rem] text-gray-900">아직 등록된 일기가 없어요</span>
          </div>
        ) : (
          <>
            <DiaryCard
              title={vm?.title || '제목 없음'}
              content={vm?.content || ''}
              date={dateObj}
              emotions={vm?.emotions || []}
            />
            <DiaryMammonCard
              title={(root?.feedbackTitle as string) || vm?.title || '제목 없음'}
              content={(root?.feedbackContent as string) || vm?.content || ''}
              date={dateObj}
              counts={counts}
              order={order}
              myToggles={myToggles}
              onToggle={handleToggle}
              className="mt-[1.2rem]"
            />
          </>
        )}
      </div>
    </div>
  );
}
