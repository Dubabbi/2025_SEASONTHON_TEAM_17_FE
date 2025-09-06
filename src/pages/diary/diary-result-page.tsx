import Pencil3D from '@assets/icons/3d-pencil.svg?react';
import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import {
  DIARY_COUNT,
  type EmotionId,
  type ReactionCounts,
} from '@pages/diary/constants/diary-emotions';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type DiaryEntry = {
  title: string;
  content: string;
  emotions: string[];
};

export default function DiaryResultPage() {
  const { state: resultState } = useLocation();
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<ReactionCounts>(DIARY_COUNT);
  const [myToggles, setMyToggles] = useState<Set<EmotionId>>(new Set());

  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    navigate('/diary');
    setOpen(false);
  };
  const handleGoRecords = () => {
    const state = { date: resultState.date };
    navigate('/diary/record', { state });
  };
  const handleToggle = (id: EmotionId) => {
    setCounts((prev) => {
      const next = { ...prev };
      const pressed = myToggles.has(id);
      next[id] = Math.max(0, (next[id] ?? 0) + (pressed ? -1 : +1));
      return next;
    });

    setMyToggles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
        title={resultState.feedbackTitle}
        content={resultState.feedbackContent}
        date={new Date()}
        order={resultState.emotions}
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
