import Pencil3D from '@assets/icons/3d-pencil.svg?react';
import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import DiaryCard from '@components/card/diary-card';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <DiaryCard title="결과" content="분석완료" onClickButton={handleOpen} />

      <DiaryCompleteSheet
        isOpen={open}
        onClose={handleClose}
        onGoRecords={handleGoRecords}
        variant="saved"
      />
    </div>
  );
}
