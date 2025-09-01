import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import InputField from '@components/inputfield';
import TextField from '@components/textfield';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DiaryCreatePage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGoRecords = () => {
    // TODO: 분석 화면 연결 -> 분석 완료 화면 연결(컴포넌트 갈아끼우기!)
    setOpen(false);
  };

  const handleGoMain = () => {
    navigate('/diary');
    setOpen(false);
  };

  return (
    <div className="flex-col gap-[5rem] px-[2.5rem] pt-[2.2rem] pb-[20rem]">
      <div className="flex-col gap-[2rem]">
        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">제목</span>
          <InputField placeholder="제목을 입력해 주세요 (최대 100자 이내)" />
        </div>
        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">오늘의 감정</span>
          <InputField placeholder="감정을 아래에서 선택하거나 직접 입력해 주세요" />
        </div>
        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">제목</span>
          <TextField placeholder="일기 내용을 입력해 주세요" />
        </div>
      </div>
      <PrimaryStrongCTA onClick={handleOpen}>작성 완료</PrimaryStrongCTA>

      <DiaryCompleteSheet
        isOpen={open}
        onClose={handleClose}
        onGoRecords={handleGoRecords}
        onGoMain={handleGoMain}
      />
    </div>
  );
}
