import Pencil3D from '@assets/icons/3d-pencil.svg?react';
import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import DiaryMammonCard from '@components/card/diary-mammon-card';
import type { ReactionCounts } from '@components/reaction/reaction-bar-chips-lite';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type DiaryEntry = {
  title: string;
  content: string;
  emotions: string[];
};

export default function DiaryResultPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    navigate('/diary');
    setOpen(false);
  };
  const handleGoRecords = () => {
    navigate('/diary/record');
  };
  const DEFAULT_COUNTS: ReactionCounts = {
    HAPPY: 1,
    SAD: 2,
    ANGRY: 3,
    EXCITE: 0,
    TIRED: 0,
    SURPRISE: 0,
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
        title="오늘의 감정분석은 이렇습니다"
        content="오늘 하루는 정말 힘들었지만, 그 속에서도 작은 기쁨을 찾으려 노력한 당신이 자랑스럽습니다. 어려운 상황에서도 긍정적인 면을 보려는 당신의 마음가짐이 빛났어요. 앞으로도 그런 긍정적인 에너지를 잃지 말고, 자신을 믿으며 나아가길 바랍니다. 당신은 충분히 강하고 멋진 사람입니다!"
        date={new Date()}
        counts={DEFAULT_COUNTS}
        myToggles={new Set()}
        onClickCheck={handleOpen}
        onToggle={() => {}}
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
