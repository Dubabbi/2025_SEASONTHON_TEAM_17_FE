import { diariesApi } from '@apis/diaries/diaries';
import { diariesQueries } from '@apis/diaries/diaries-queries';
import Pencil3D from '@assets/icons/3d-pencil.svg?react';
import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import {
  DIARY_COUNT,
  type EmotionId,
  type ReactionCounts,
} from '@pages/diary/constants/diary-emotions';
import { emotionLikeStore, useEmotionLikesVersion } from '@pages/diary/stores/emotion-like-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type EmotionDTO = { id?: number; type: EmotionId; likeCount: number };
type ResultState = {
  date?: string | Date;
  feedbackTitle?: string;
  feedbackContent?: string;
  emotions?: EmotionId[];
};
type EmotionRaw =
  | string
  | {
      emotionId?: number;
      type?: unknown;
      likeCount?: unknown;
    };

export type DiaryEntry = {
  title: string;
  content: string;
  emotions: string[];
};

export default function DiaryResultPage() {
  const location = useLocation();
  const resultState = (location.state ?? {}) as ResultState;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const likesVer = useEmotionLikesVersion();

  const resultDate: Date = useMemo(() => {
    const raw = resultState?.date;
    if (raw instanceof Date) return raw;
    if (typeof raw === 'string') {
      const d = dayjs(raw);
      return d.isValid() ? d.toDate() : new Date(raw);
    }
    return new Date();
  }, [resultState?.date]);

  const y = useMemo(() => dayjs(resultDate).year(), [resultDate]);
  const m = useMemo(() => dayjs(resultDate).month() + 1, [resultDate]);
  const d = useMemo(() => dayjs(resultDate).date(), [resultDate]);

  const entryQ = useQuery({ ...diariesQueries.byDate(y, m, d) });

  const emotionDtos = useMemo<EmotionDTO[]>(() => {
    const raw = entryQ.data?.data?.emotions as unknown;
    if (!Array.isArray(raw)) return [];
    return (raw as EmotionRaw[])
      .map((e) => {
        if (typeof e === 'string') return { id: undefined, type: e as EmotionId, likeCount: 0 };
        const obj = e as Exclude<EmotionRaw, string>;
        const tRaw = obj?.type;
        const t = typeof tRaw === 'string' ? (tRaw as EmotionId) : undefined;
        if (!t) return null;
        return {
          id: typeof obj?.emotionId === 'number' ? obj.emotionId : undefined,
          type: t,
          likeCount: Number(obj?.likeCount ?? 0),
        } as EmotionDTO;
      })
      .filter((v): v is EmotionDTO => v !== null);
  }, [entryQ.data]);

  const emotionIdByType = useMemo<Record<EmotionId, number | undefined>>(() => {
    const map = {} as Record<EmotionId, number | undefined>;
    for (const e of emotionDtos) map[e.type] = e.id;
    return map;
  }, [emotionDtos]);

  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<ReactionCounts>({ ...DIARY_COUNT });
  const [myToggles, setMyToggles] = useState<Set<EmotionId>>(new Set());

  useEffect(() => {
    void likesVer;
    const set = new Set<EmotionId>();
    for (const e of emotionDtos) {
      if (e.id && emotionLikeStore.isLiked(e.id)) {
        set.add(e.type);
        break;
      }
    }
    const nextCounts: ReactionCounts = { ...DIARY_COUNT };
    for (const t of set) nextCounts[t] = (nextCounts[t] ?? 0) + 1;
    setMyToggles(set);
    setCounts(nextCounts);
  }, [emotionDtos, likesVer]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    navigate('/diary');
    setOpen(false);
  };

  const handleGoRecords = () => {
    const state = { date: resultDate };
    navigate('/diary/record', { state });
  };

  const handleToggle = async (id: EmotionId) => {
    const nextId = emotionIdByType[id];
    const prevType = (() => {
      for (const t of myToggles) return t;
      return undefined;
    })();
    const same = prevType === id;
    const prevId = prevType ? emotionIdByType[prevType] : undefined;

    setCounts((prev) => {
      const n = { ...prev };
      if (prevType) n[prevType] = Math.max(0, (n[prevType] ?? 0) - 1);
      if (!same) n[id] = Math.max(0, (n[id] ?? 0) + 1);
      return n;
    });

    setMyToggles(() => {
      const s = new Set<EmotionId>();
      if (!same) s.add(id);
      return s;
    });

    try {
      if (prevId && emotionLikeStore.isLiked(prevId)) {
        emotionLikeStore.setLiked(prevId, false);
        await diariesApi.likeEmotion(prevId);
      }
      if (!same && nextId && !emotionLikeStore.isLiked(nextId)) {
        emotionLikeStore.setLiked(nextId, true);
        await diariesApi.likeEmotion(nextId);
      }
      qc.invalidateQueries({
        queryKey: diariesQueries.byDate(y, m, d).queryKey,
      });
    } catch {
      if (prevId) emotionLikeStore.setLiked(prevId, true);
      if (nextId) emotionLikeStore.setLiked(nextId, false);
      const rollback: ReactionCounts = { ...DIARY_COUNT };
      const storeSelected = (() => {
        for (const e of emotionDtos) if (e.id && emotionLikeStore.isLiked(e.id)) return e.type;
        return undefined;
      })();
      if (storeSelected) rollback[storeSelected] = (rollback[storeSelected] ?? 0) + 1;
      setCounts(rollback);
      setMyToggles(() => {
        const s = new Set<EmotionId>();
        if (storeSelected) s.add(storeSelected);
        return s;
      });
      qc.invalidateQueries({
        queryKey: diariesQueries.byDate(y, m, d).queryKey,
      });
    }
  };

  return (
    <div className="flex-col-center gap-[2rem] px-[2.4rem] pt-[2rem] pb-[20rem]">
      <Pencil3D className="h-[20rem] w-[20rem]" />
      <p className="body1-500 text-center text-gray-900">
        마몬이 분석한 내용이에요!
        <br />
        마몬의 <span className="text-primary-800">따듯한 말 한마디</span>와 함께
        <br />
        분석한 감정을 확인해보세요!
      </p>
      <DiaryMammonCard
        title={resultState?.feedbackTitle}
        content={resultState?.feedbackContent}
        date={new Date()}
        order={(resultState?.emotions as EmotionId[]) ?? []}
        counts={counts}
        myToggles={myToggles}
        onClickCheck={handleOpen}
        onToggle={handleToggle}
      />

      <DiaryCompleteSheet
        isOpen={open}
        onClose={handleClose}
        onGoRecords={handleGoRecords}
        variant="saved"
      />
    </div>
  );
}
