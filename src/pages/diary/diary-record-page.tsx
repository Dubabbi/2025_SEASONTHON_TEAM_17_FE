// src/pages/diary/diary-record-page.tsx

import { updateDiaryPrivacy } from '@apis/diaries/diaries';
import { diariesQueries } from '@apis/diaries/diaries-queries';
import Calendar from '@components/calendar/calendar';
import DiaryCard from '@components/card/diary-card';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { EmotionId, ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import TipInfo from '@components/tipinfo';
import type { DiaryEntry } from '@pages/diary/diary-page';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type DiaryCreateState =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; date: string; entry: DiaryEntry };

const keyOf = (d: Date) => dayjs(d).format('YYYY-MM-DD');

const DEFAULT_COUNTS: ReactionCounts = {
  HAPPY: 5,
  SAD: 0,
  ANGRY: 0,
  EXCITE: 0,
  TIRED: 0,
  SURPRISE: 0,
};

type EmotionRaw = string | { type: string };

export default function DiaryRecordPage() {
  const [selected, setSelected] = useState(new Date());
  const [view, setView] = useState<Date>(selected);
  const navigate = useNavigate();
  const qc = useQueryClient();

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
  const entryData = entryRes?.data as DiaryEntry & {
    id?: number;
    privacySetting?: 'PUBLIC' | 'PRIVACY';
    feedbackTitle?: string;
    feedbackContent?: string;
    emotions?: EmotionRaw[];
  };

  const entryEmotions = useMemo<string[]>(() => {
    const raw = entryData?.emotions as unknown;
    if (!Array.isArray(raw)) return [];
    return (raw as EmotionRaw[]).map((e) => (typeof e === 'string' ? e : e.type));
  }, [entryData]);

  const hasEntry = !!(entryData && (entryData.title || entryData.content || entryEmotions.length));

  const onCardAction = (type: '작성하기' | '수정하기') => {
    if (type === '작성하기') {
      const state: DiaryCreateState = { mode: 'create', date: selectedKey };
      navigate('/diary/create', { state });
      return;
    }
    if (!entryData) return;
    const state: DiaryCreateState = {
      mode: 'edit',
      date: selectedKey,
      entry: {
        title: entryData.title,
        content: entryData.content,
        emotions: entryEmotions,
        privacySetting: entryData.privacySetting,
      },
    };
    navigate('/diary/create', { state });
  };

  const [countsByDate, setCountsByDate] = useState<Record<string, ReactionCounts>>({});
  const [togglesByDate, setTogglesByDate] = useState<Record<string, Set<EmotionId>>>({});

  const counts = hasEntry ? (countsByDate[selectedKey] ?? DEFAULT_COUNTS) : DEFAULT_COUNTS;
  const myToggles = hasEntry
    ? (togglesByDate[selectedKey] ?? new Set<EmotionId>())
    : new Set<EmotionId>();

  const handleToggle = useCallback(
    (id: EmotionId) => {
      if (!hasEntry) return;
      setCountsByDate((prev) => {
        const base = prev[selectedKey] ?? DEFAULT_COUNTS;
        const next = { ...base };
        const pressed = (togglesByDate[selectedKey] ?? new Set<EmotionId>()).has(id);
        next[id] = Math.max(0, (next[id] ?? 0) + (pressed ? -1 : +1));
        return { ...prev, [selectedKey]: next };
      });
      setTogglesByDate((prev) => {
        const set = new Set<EmotionId>(prev[selectedKey] ?? []);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        return { ...prev, [selectedKey]: set };
      });
    },
    [hasEntry, selectedKey, togglesByDate],
  );

  const privacyMutation = useMutation({
    mutationFn: (vars: { id: number; next: 'PUBLIC' | 'PRIVACY' }) =>
      updateDiaryPrivacy(vars.id, vars.next),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });

  const onTogglePrivacy = () => {
    if (!entryData?.id || !entryData?.privacySetting) return;
    const next = entryData.privacySetting === 'PUBLIC' ? 'PRIVACY' : 'PUBLIC';
    privacyMutation.mutate({ id: entryData.id, next });
  };

  return (
    <div className="flex-col gap-[3rem] px-[2.4rem] pt-[2.2rem] pb-[17rem]">
      <TipInfo
        title="나의 감정 일기 기록 이용 TIP"
        text="아래 날짜를 클릭하면 당시 기록한 감정 일기를 볼 수 있어요"
      />

      <div className="flex-col gap-[1.5rem]">
        <h1 className="heading1-700">월별 기록</h1>
        <section>
          <Calendar
            value={selected}
            onChange={setSelected}
            marked={marked}
            onMonthChange={setView}
          />
        </section>
      </div>

      <div className="pt-[0.8rem]">
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
            myToggles={myToggles}
            onToggle={handleToggle}
            className="mt-[1.2rem]"
          />
        )}
      </div>
    </div>
  );
}
