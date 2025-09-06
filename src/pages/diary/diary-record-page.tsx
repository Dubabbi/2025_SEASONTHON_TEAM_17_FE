import { updateDiaryPrivacy } from '@apis/diaries/diaries';
import { diariesQueries } from '@apis/diaries/diaries-queries';
import Calendar from '@components/calendar/calendar';
import DiaryCard from '@components/card/diary-card';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { EmotionId, ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import TipInfo from '@components/tipinfo';
import { DIARY_COUNT } from '@pages/diary/constants/diary-emotions';
import type { DiaryEntry } from '@pages/diary/diary-page';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type DiaryCreateState =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; date: string; entry: DiaryEntry };

const DIARY_ENTRIES: Record<string, DiaryEntry> = {
  '2025-08-01': {
    title: '오늘은...',
    content: '맛있는 걸 먹어서 기분이 좋은 날이다.',
    emotions: ['HAPPY'],
  },
  '2025-08-08': {
    title: '집중의 하루',
    content: '순공 시간 12시간 달성했다. 재미 없다,,',
    emotions: ['SAD', 'ANGRY'],
  },
  '2025-08-09': {
    title: '휴식',
    content: '산책으로 머리 식혔다...',
    emotions: ['SAD'],
  },
  '2025-08-15': {
    title: '왠지 기분이 좋은 날',
    content: '오랜만에 나들이',
    emotions: ['EXCITE'],
  },
  '2025-08-27': {
    title: '좋아하는 친구들을 만났다.',
    content: '역시 친구들을 만나니까 기분이 좋은 것 같다.',
    emotions: ['EXCITE'],
  },
  '2025-09-03': {
    title: '행복',
    content: '좋아하는 휘낭시에랑 마들렌을 잔뜩 먹었다!! 맛있으면 0칼로리;;',
    emotions: ['HAPPY'],
  },
  '2025-09-14': {
    title: '슬픈 영화를 봤다.',
    content: '베일리 어게인 보고 내내 울었다...',
    emotions: ['SAD'],
  },
};

const keyOf = (d: Date) => dayjs(d).format('YYYY-MM-DD');
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

  const counts = hasEntry ? (countsByDate[selectedKey] ?? DIARY_COUNT) : DIARY_COUNT;
  const myToggles = hasEntry
    ? (togglesByDate[selectedKey] ?? new Set<EmotionId>())
    : new Set<EmotionId>();

  const handleToggle = useCallback(
    (id: EmotionId) => {
      if (!hasEntry) return;
      setCountsByDate((prev) => {
        const base = prev[selectedKey] ?? DIARY_COUNT;
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
          <Calendar value={selected} onChange={setSelected} marked={marked} />
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
