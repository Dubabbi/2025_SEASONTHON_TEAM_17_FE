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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type DiaryCreateState = { mode: 'create'; date: string };

const keyOf = (d: Date) => dayjs(d).format('YYYY-MM-DD');

type EmotionRaw = string | { type: string };

export default function DiaryRecordPage() {
  const [selected, setSelected] = useState(new Date());
  const [view, setView] = useState<Date>(selected);
  const { state } = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  console.log('state', { ...state });

  const deleteSheet = useBottomSheet();

  useEffect(() => {
    const parsed =
      typeof state.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(state)
        ? dayjs(state.date).toDate()
        : state.date;
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

  const { data: entryRes } = useQuery(diariesQueries.byDate(y, m, d));
  const entryData = entryRes?.data as
    | (DiaryEntry & {
        diaryId?: number;
        emotions?: EmotionRaw[];
      })
    | undefined;

  const entryEmotions = useMemo<string[]>(() => {
    const raw = entryData?.emotions as unknown;
    if (!Array.isArray(raw)) return [];
    return (raw as EmotionRaw[]).map((e) => (typeof e === 'string' ? e : e.type));
  }, [entryData]);

  const hasEntry = !!(entryData && (entryData.title || entryData.content || entryEmotions.length));
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

  const INITIAL_COUNTS = useMemo<ReactionCounts>(() => {
    const ids = (entryEmotions ?? []) as EmotionId[];
    const result = {} as ReactionCounts;
    ids.forEach((id) => {
      if (result[id] == null) result[id] = 0;
    });
    return result;
  }, [entryEmotions]);

  const counts = hasEntry ? (countsByDate[selectedKey] ?? INITIAL_COUNTS) : INITIAL_COUNTS;

  const myToggles = hasEntry
    ? (togglesByDate[selectedKey] ?? new Set<EmotionId>())
    : new Set<EmotionId>();

  const handleToggle = useCallback(
    (id: EmotionId) => {
      if (!hasEntry) return;
      setCountsByDate((prev) => {
        const base = prev[selectedKey] ?? INITIAL_COUNTS;
        const next: ReactionCounts = { ...base };
        const pressed = (togglesByDate[selectedKey] ?? new Set<EmotionId>()).has(id);
        const cur = next[id] ?? 0;
        next[id] = Math.max(0, cur + (pressed ? -1 : 1));
        return { ...prev, [selectedKey]: next };
      });
      setTogglesByDate((prev) => {
        const set = new Set<EmotionId>(prev[selectedKey] ?? []);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        return { ...prev, [selectedKey]: set };
      });
    },
    [hasEntry, selectedKey, togglesByDate, INITIAL_COUNTS],
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
