import { diariesApi, updateDiaryPrivacy } from '@apis/diaries/diaries';
import { diariesQueries } from '@apis/diaries/diaries-queries';
import DeleteConfirmSheet from '@components/bottom-sheet/delete-confirm-sheet';
import Button from '@components/button/button';
import Calendar from '@components/calendar/calendar';
import DiaryCard from '@components/card/diary-card';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { EmotionId, ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import { useToast } from '@contexts/toast-context';
import useBottomSheet from '@hooks/use-bottom-sheet';
import Banner from '@pages/diary/components/banner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type DiaryEntry = {
  id?: number;
  diaryId?: number;
  title: string;
  content: string;
  emotions: string[];
  privacySetting?: 'PUBLIC' | 'PRIVACY';
  feedbackTitle?: string;
  feedbackContent?: string;
};

type EmotionRaw = string | { type: string };

type DiaryCreateState = { mode: 'create'; date: string };

export default function DiaryPage() {
  const [selected, setSelected] = useState(new Date());
  const [view, setView] = useState<Date>(selected);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const deleteSheet = useBottomSheet();

  const selectedKey = useMemo(() => dayjs(selected).format('YYYY-MM-DD'), [selected]);
  const y = useMemo(() => dayjs(view).year(), [view]);
  const m = useMemo(() => dayjs(view).month() + 1, [view]);
  const d = useMemo(() => dayjs(selected).date(), [selected]);

  const { data: monthRes } = useQuery(diariesQueries.monthDates(y, m));
  const markedDates = useMemo(
    () =>
      (monthRes?.data ?? []).map(
        (dayNum: number) => `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
      ),
    [monthRes?.data, y, m],
  );

  const { data: entryRes } = useQuery(diariesQueries.byDate(y, m, d));
  const entryData = entryRes?.data as DiaryEntry | undefined;

  const entryEmotions = useMemo<string[]>(() => {
    const raw = entryData?.emotions as unknown;
    if (!Array.isArray(raw)) return [];
    return (raw as EmotionRaw[]).map((e) => (typeof e === 'string' ? e : e.type));
  }, [entryData]);

  const hasEntry = !!(entryData && (entryData.title || entryData.content || entryEmotions.length));
  const entryId = (entryData as any)?.diaryId ?? (entryData as any)?.id;

  const goRecord = () => navigate('/diary/record');

  const handleCardAction = (type: '작성하기' | '삭제하기') => {
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

  const INITIAL_COUNTS: ReactionCounts = useMemo(() => {
    const ids = (entryEmotions ?? []) as EmotionId[];
    return ids.reduce((acc, id) => {
      (acc as any)[id] = (acc as any)[id] ?? 0;
      return acc;
    }, {} as ReactionCounts);
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
        const next = { ...base };
        const pressed = (togglesByDate[selectedKey] ?? new Set<EmotionId>()).has(id);
        const cur = (next as any)[id] ?? 0;
        (next as any)[id] = Math.max(0, cur + (pressed ? -1 : 1));
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
    onMutate: async (id: number) => {
      await qc.cancelQueries({
        queryKey: diariesQueries.byDate(y, m, d).queryKey,
      });
      const prev = qc.getQueryData(diariesQueries.byDate(y, m, d).queryKey);
      qc.setQueryData(diariesQueries.byDate(y, m, d).queryKey, (p: any) =>
        p ? { ...p, data: null } : { data: null },
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(diariesQueries.byDate(y, m, d).queryKey, ctx.prev);
    },
    onSuccess: async () => {
      qc.invalidateQueries({
        queryKey: diariesQueries.monthDates(y, m).queryKey,
      });
      try {
        await diariesApi.byDate({ year: y, month: m, day: d });
      } catch (_e) {}
    },
    onSettled: () => {
      deleteSheet.close();
    },
  });

  const onTogglePrivacy = () => {
    if (!entryData?.privacySetting || !entryId) return;
    const next = entryData.privacySetting === 'PUBLIC' ? 'PRIVACY' : 'PUBLIC';
    privacyMutation.mutate({ id: entryId, next });
  };

  const onConfirmDelete = () => {
    if (!entryId) return;
    deleteMutation.mutate(entryId);
  };
  const { data: today } = useQuery(diariesQueries.today());
  const { showToast } = useToast();
  const handleClickToday = () => {
    if (!today?.data?.written) {
      navigate('/diary/create');
    } else {
      showToast(today.message);
    }
  };
  return (
    <>
      <div className="min-h-dvh w-full flex-col bg-cover bg-gradient-bgd1 bg-no-repeat pb-[17rem]">
        <Banner gradientClass="bg-gradient-bgd3" onClick={handleClickToday} />
        <div className="flex-col px-[2rem]">
          <div className="flex-row-between">
            <div className="flex-col gap-[0.4rem] pt-[3.2rem] pb-[2rem]">
              <h1 className="heading1-700 text-gray-900">나의 감정 일기 기록</h1>
              <p className="body2-500 text-gray-500">날짜별로 정리하고 간단하게 확인할 수 있어요</p>
            </div>
            <Button
              className="body2-500 rounded-full bg-gray-50 px-[1.6rem] py-[0.55rem] text-primary-800 outline outline-primary-800"
              onClick={goRecord}
            >
              전체 기록 보기
            </Button>
          </div>
          <div className="flex-col gap-[2rem]">
            <Calendar
              value={selected}
              onChange={setSelected}
              marked={markedDates}
              onMonthChange={setView}
            />

            <DiaryCard
              title={entryData?.title}
              content={entryData?.content}
              emotions={entryEmotions}
              date={selected}
              onClickButton={handleCardAction}
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
                className="mt-[0.4rem]"
              />
            )}
          </div>
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
