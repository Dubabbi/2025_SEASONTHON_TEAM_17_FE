import Button from '@components/button/button';
import Calendar from '@components/calendar/calendar';
import DiaryCard from '@components/card/diary-card';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { EmotionId, ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import Banner from '@pages/diary/components/banner';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type DiaryEntry = {
  title: string;
  content: string;
  emotions: string[];
};

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
    content: '순공 시간 12시간 달성했다. 재미 없다..',
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

export default function DiaryPage() {
  const [selected, setSelected] = useState(new Date());
  const navigate = useNavigate();

  const selectedKey = useMemo(() => dayjs(selected).format('YYYY-MM-DD'), [selected]);
  const entry = DIARY_ENTRIES[selectedKey];
  const markedDates = useMemo(() => Object.keys(DIARY_ENTRIES), []);

  const goRecord = () => navigate('/diary/record');

  const handleCardAction = (type: '작성하기' | '수정하기') => {
    if (type === '작성하기') {
      const state: DiaryCreateState = { mode: 'create', date: selectedKey };
      navigate('/diary/create', { state });
      return;
    }
    if (!entry) return;
    const state: DiaryCreateState = { mode: 'edit', date: selectedKey, entry };
    navigate('/diary/create', { state });
  };

  const DEFAULT_COUNTS: ReactionCounts = {
    HAPPY: 1,
    SAD: 2,
    ANGRY: 3,
    EXCITE: 0,
    TIRED: 0,
    SURPRISE: 0,
  };

  const [countsByDate, setCountsByDate] = useState<Record<string, ReactionCounts>>({});
  const [togglesByDate, setTogglesByDate] = useState<Record<string, Set<EmotionId>>>({});

  const hasEntry = !!(entry && (entry.title || entry.content || entry.emotions?.length));
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

  return (
    <div className="min-h-dvh w-full flex-col bg-cover bg-gradient-bgd1 bg-no-repeat pb-[17rem]">
      <Banner gradientClass="bg-gradient-bgd3" />
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

        <Calendar value={selected} onChange={setSelected} marked={markedDates} />

        <div className="pt-[1.6rem] pb-[2.4rem]">
          <DiaryCard
            title={entry?.title}
            content={entry?.content}
            emotions={entry?.emotions ?? []}
            date={selected}
            onClickButton={handleCardAction}
          />

          {/*  일기 있는 날짜에만 From.마몬 카드 노출 */}
          {hasEntry && entry && (
            <DiaryMammonCard
              title={entry.title}
              content={entry.content}
              date={selected}
              counts={counts}
              myToggles={myToggles}
              onToggle={handleToggle}
              className="mt-[0.4rem]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
