import { diariesQueries } from '@apis/diaries/diaries-queries';
import ThinkIcon from '@assets/icons/thinking.svg?react';
import DiaryCard from '@components/card/diary-card';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { EmotionId, ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import { DIARY_EMOTIONS } from '@pages/diary/constants/diary-emotions';
import { type DetailVM, toDetailVM } from '@pages/friends/utils/to-detail-vm';
import { useQuery } from '@tanstack/react-query';
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

  const detailQ = useQuery({ ...diariesQueries.detail(idNum), enabled });

  const vm: DetailVM | null = useMemo(() => toDetailVM(detailQ.data), [detailQ.data]);

  const root = useMemo(() => {
    const r =
      isObj(detailQ.data) && 'data' in detailQ.data ? (detailQ.data as any).data : detailQ.data;
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
        const id = Number((e as any)?.emotionId);
        const typeRaw = (e as any)?.type;
        const likeCount = Number((e as any)?.likeCount ?? 0);
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

  const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
  const [myToggles, setMyToggles] = useState<Set<EmotionId>>(new Set());

  useEffect(() => {
    setCounts(initialCounts);
    setMyToggles(new Set());
  }, [initialCounts]);

  const order = useMemo<EmotionId[]>(() => emotionDtos.map((e) => e.type), [emotionDtos]);

  const handleToggle = useCallback(
    (id: EmotionId) => {
      setCounts((prev) => {
        const next = { ...prev };
        const pressed = myToggles.has(id);
        const cur = next[id] ?? 0;
        next[id] = Math.max(0, cur + (pressed ? -1 : 1));
        return next;
      });
      setMyToggles((prev) => {
        const set = new Set(prev);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        return set;
      });
    },
    [myToggles],
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
              title={vm.title || '제목 없음'}
              content={vm.content || ''}
              date={dateObj}
              emotions={vm.emotions}
            />
            <DiaryMammonCard
              title={(root?.feedbackTitle as string) || vm.title || '제목 없음'}
              content={(root?.feedbackContent as string) || vm.content || ''}
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
