import { diariesApi, updateDiaryPrivacy } from '@apis/diaries/diaries';
import { diariesQueries } from '@apis/diaries/diaries-queries';
import DeleteConfirmSheet from '@components/bottom-sheet/delete-confirm-sheet';
import Calendar from '@components/calendar/calendar';
import DiaryCard from '@components/card/diary-card';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { EmotionId, ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import TipInfo from '@components/tipinfo';
import useBottomSheet from '@hooks/use-bottom-sheet';
import type { DiaryEntry } from '@pages/diary/diary-page';
import { emotionLikeStore, useEmotionLikesVersion } from '@pages/diary/stores/emotion-like-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type DiaryCreateState = { mode: 'create'; date: string };

const keyOf = (d: Date) => dayjs(d).format('YYYY-MM-DD');

type EmotionRaw = string | { emotionId: number; type: string; likeCount: number };
type EmotionDTO = { id?: number; type: EmotionId; likeCount: number };

export default function DiaryRecordPage() {
  const [selected, setSelected] = useState(new Date());
  const [view, setView] = useState<Date>(selected);
  const { state } = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const deleteSheet = useBottomSheet();

  useEffect(() => {
    const parsed =
      typeof state?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(state)
        ? dayjs(state?.date).toDate()
        : state?.date;
    setSelected(parsed);
  }, [state]);

  const selectedKey = useMemo(() => keyOf(selected), [selected]);
  const y = useMemo(() => dayjs(view).year(), [view]);
  const m = useMemo(() => dayjs(view).month() + 1, [view]);
  const d = useMemo(() => dayjs(selected).date(), [selected]);

  const { data: monthRes } = useQuery(diariesQueries.monthDates(y, m));
  const marked = useMemo(
    () =>
      (monthRes?.data ?? []).map(
        (dayNum: number) => `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
      ),
    [monthRes?.data, y, m],
  );

  const entryQ = useQuery({
    ...diariesQueries.byDate(y, m, d),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const entryData = entryQ.data?.data as
    | (DiaryEntry & {
        diaryId?: number;
        emotions?: EmotionRaw[];
      })
    | undefined;

  const emotionDtos = useMemo<EmotionDTO[]>(() => {
    const arr = entryData?.emotions as unknown;
    if (!Array.isArray(arr)) return [];
    return (arr as EmotionRaw[])
      .map((e) => {
        if (typeof e === 'string') return { id: undefined, type: e as EmotionId, likeCount: 0 };
        const t = typeof e.type === 'string' ? (e.type as EmotionId) : undefined;
        if (!t) return null;
        return {
          id: e.emotionId,
          type: t,
          likeCount: Number(e.likeCount ?? 0),
        };
      })
      .filter((v): v is EmotionDTO => v !== null);
  }, [entryData?.emotions]);

  const entryEmotions = useMemo<EmotionId[]>(() => emotionDtos.map((e) => e.type), [emotionDtos]);

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

  const hasServerIds = useMemo(
    () => emotionDtos.some((e) => typeof e.id === 'number'),
    [emotionDtos],
  );

  const hasEntry = !!(
    entryData &&
    (entryData.title || entryData.content || entryEmotions.length > 0)
  );
  const entryId: number | undefined = entryData?.diaryId ?? entryData?.id;

  const onCardAction = (type: '작성하기' | '삭제하기') => {
    if (type === '작성하기') {
      const state: DiaryCreateState = { mode: 'create', date: selectedKey };
      navigate('/diary/create', { state });
      return;
    }
    if (type === '삭제하기') {
      if (!hasEntry) return;
      deleteSheet.open();
      return;
    }
  };

  const [countsByDate, setCountsByDate] = useState<Record<string, ReactionCounts>>({});
  const [togglesByDate, setTogglesByDate] = useState<Record<string, Set<EmotionId>>>({});
  const likesVer = useEmotionLikesVersion();

  const counts = hasEntry ? (countsByDate[selectedKey] ?? initialCounts) : initialCounts;

  const currentSelectedType = useMemo<EmotionId | undefined>(() => {
    void likesVer;
    if (!hasEntry) return undefined;
    if (hasServerIds) {
      for (const t of entryEmotions) {
        const eid = emotionIdByType[t];
        if (eid && emotionLikeStore.isLiked(eid)) return t;
      }
      return undefined;
    }
    const set = togglesByDate[selectedKey] ?? new Set<EmotionId>();
    for (const t of set) return t;
    return undefined;
  }, [
    hasEntry,
    hasServerIds,
    entryEmotions,
    emotionIdByType,
    togglesByDate,
    selectedKey,
    likesVer,
  ]);

  const myToggles = useMemo(() => {
    void likesVer;
    if (!hasEntry) return new Set<EmotionId>();
    if (hasServerIds) {
      const s = new Set<EmotionId>();
      if (currentSelectedType) s.add(currentSelectedType);
      return s;
    }
    return togglesByDate[selectedKey] ?? new Set<EmotionId>();
  }, [hasEntry, hasServerIds, currentSelectedType, togglesByDate, selectedKey, likesVer]);

  const handleToggle = useCallback(
    async (typeId: EmotionId) => {
      if (!hasEntry) return;
      const prevType = currentSelectedType;
      const same = prevType === typeId;
      const nextType = same ? undefined : typeId;

      if (hasServerIds) {
        const prevId = prevType ? emotionIdByType[prevType] : undefined;
        const nextId = nextType ? emotionIdByType[nextType] : undefined;

        const prevLiked = prevId ? emotionLikeStore.isLiked(prevId) : false;
        const nextLiked = nextId ? emotionLikeStore.isLiked(nextId) : false;

        if (prevId && prevLiked) emotionLikeStore.setLiked(prevId, false);
        if (nextId && !same) emotionLikeStore.setLiked(nextId, true);
        if (prevType) {
          setCountsByDate((p) => {
            const base = p[selectedKey] ?? initialCounts;
            const n = { ...base };
            const cur = n[prevType] ?? 0;
            n[prevType] = Math.max(0, cur - 1);
            return { ...p, [selectedKey]: n };
          });
        }
        if (nextType) {
          setCountsByDate((p) => {
            const base = p[selectedKey] ?? initialCounts;
            const n = { ...base };
            const cur = n[nextType] ?? 0;
            n[nextType] = Math.max(0, cur + 1);
            return { ...p, [selectedKey]: n };
          });
        }

        try {
          if (prevId && prevLiked) await diariesApi.likeEmotion(prevId);
          if (nextId && !same && !nextLiked) await diariesApi.likeEmotion(nextId);
        } catch {
          if (prevId) emotionLikeStore.setLiked(prevId, prevLiked);
          if (nextId) emotionLikeStore.setLiked(nextId, nextLiked);
          setCountsByDate((p) => ({ ...p, [selectedKey]: initialCounts }));
        } finally {
          qc.invalidateQueries({
            queryKey: diariesQueries.byDate(y, m, d).queryKey,
          });
        }
      } else {
        setTogglesByDate((prev) => {
          const set = new Set<EmotionId>();
          if (nextType) set.add(nextType);
          return { ...prev, [selectedKey]: set };
        });
        if (prevType) {
          setCountsByDate((p) => {
            const base = p[selectedKey] ?? initialCounts;
            const n = { ...base };
            const cur = n[prevType] ?? 0;
            n[prevType] = Math.max(0, cur - 1);
            return { ...p, [selectedKey]: n };
          });
        }
        if (nextType) {
          setCountsByDate((p) => {
            const base = p[selectedKey] ?? initialCounts;
            const n = { ...base };
            const cur = n[nextType] ?? 0;
            n[nextType] = Math.max(0, cur + 1);
            return { ...p, [selectedKey]: n };
          });
        }
      }
    },
    [
      hasEntry,
      hasServerIds,
      currentSelectedType,
      emotionIdByType,
      selectedKey,
      initialCounts,
      qc,
      y,
      m,
      d,
    ],
  );

  const privacyMutation = useMutation({
    mutationFn: (vars: { id: number; next: 'PUBLIC' | 'PRIVACY' }) =>
      updateDiaryPrivacy(vars.id, vars.next),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: diariesQueries.byDate(y, m, d).queryKey,
      });
      qc.invalidateQueries({
        queryKey: diariesQueries.monthDates(y, m).queryKey,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => diariesApi.remove(id),
    onMutate: async (_id: number) => {
      await qc.cancelQueries({
        queryKey: diariesQueries.byDate(y, m, d).queryKey,
      });
      const prev = qc.getQueryData(diariesQueries.byDate(y, m, d).queryKey);
      qc.setQueryData(diariesQueries.byDate(y, m, d).queryKey, (p: unknown) => {
        const obj = p as { data?: unknown } | undefined;
        return obj ? { ...obj, data: null } : { data: null };
      });
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(diariesQueries.byDate(y, m, d).queryKey, ctx.prev);
      }
    },
    onSuccess: async () => {
      qc.invalidateQueries({
        queryKey: diariesQueries.monthDates(y, m).queryKey,
      });
      void diariesApi.byDate({ year: y, month: m, day: d }).catch(() => undefined);
    },
    onSettled: () => {
      deleteSheet.close();
    },
  });

  const onTogglePrivacy = () => {
    if (!entryId || !entryData?.privacySetting) return;
    const next = entryData.privacySetting === 'PUBLIC' ? 'PRIVACY' : 'PUBLIC';
    privacyMutation.mutate({ id: entryId, next });
  };

  const onConfirmDelete = () => {
    if (!entryId) return;
    deleteMutation.mutate(entryId);
  };

  return (
    <>
      <div className="flex-col gap-[3rem] px-[2.4rem] pt-[2.2rem] pb-[17rem]">
        <TipInfo
          title="나의 감정 일기 기록 이용 TIP"
          text="아래 날짜를 클릭하면 당시 기록한 감정 일기를 볼 수 있어요"
        />

        <div className="flex-col gap-[1.5rem]">
          <h1 className="heading1-700">월별 기록</h1>
          <section className="flex-col gap-[2rem]">
            <Calendar
              value={selected}
              onChange={setSelected}
              marked={marked}
              onMonthChange={setView}
            />

            <DiaryCard
              title={entryData?.title}
              content={entryData?.content}
              emotions={entryEmotions}
              date={selected}
              onClickButton={onCardAction}
              privacySetting={entryData?.privacySetting as 'PUBLIC' | 'PRIVACY' | undefined}
              onTogglePrivacy={onTogglePrivacy}
            />

            {hasEntry && entryData && (
              <DiaryMammonCard
                title={entryData.feedbackTitle ?? entryData.title}
                content={entryData.feedbackContent ?? entryData.content}
                date={selected}
                counts={counts}
                order={entryEmotions as EmotionId[]}
                myToggles={myToggles}
                onToggle={handleToggle}
              />
            )}
          </section>
        </div>
      </div>

      <DeleteConfirmSheet
        isOpen={deleteSheet.isOpen}
        onClose={deleteSheet.close}
        onConfirm={onConfirmDelete}
        confirmDisabled={!entryId || deleteMutation.isPending}
      />
    </>
  );
}
