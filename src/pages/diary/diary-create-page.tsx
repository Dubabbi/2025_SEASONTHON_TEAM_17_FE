import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import InputField from '@components/inputfield';
import TextField from '@components/textfield';
import ToggleButton from '@pages/diary/components/toggle-button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DiaryCreatePage() {
  const [open, setOpen] = useState(false);
  const [diaryInfo, setDiaryInfo] = useState({
    title: '',
    content: '',
    range: '',
  });
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    navigate('/diary');
    setOpen(false);
  };
  const buttonActive =
    diaryInfo.title.length < 100 && diaryInfo.content.length >= 100 && diaryInfo.range;

  const handleGoRecords = () => {
    // TODO: 분석 화면 연결 -> 분석 완료 화면 연결(컴포넌트 갈아끼우기!)
    setOpen(false);
  };

  return (
    <div className="flex-col gap-[5rem] px-[2.5rem] pt-[2.2rem] pb-[20rem]">
      <div className="flex-col gap-[2rem]">
        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">제목</span>
          <InputField
            value={diaryInfo.title}
            onChange={(e) => setDiaryInfo((prev) => ({ ...prev, title: e.target.value }))}
            variant={
              !diaryInfo.title ? 'default' : diaryInfo.title.length >= 100 ? 'error' : 'success'
            }
            placeholder="제목을 입력해 주세요 (최대 100자 이내)"
            helperText={
              diaryInfo
                ? diaryInfo.title.length >= 100
                  ? '제목이 100자 이상입니다.'
                  : '제목이 100자 이내입니다.'
                : undefined
            }
          />
        </div>
        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">내용</span>
          <TextField
            value={diaryInfo.content}
            onChange={(e) => setDiaryInfo((prev) => ({ ...prev, content: e.target.value }))}
            variant={
              !diaryInfo.content ? 'default' : diaryInfo.content.length < 100 ? 'error' : 'success'
            }
            placeholder="일기 내용을 입력해 주세요"
            helperText={
              !diaryInfo.content
                ? '내용은 최소 100자 이상으로 적어야 합니다.'
                : diaryInfo.content.length < 100
                  ? `현재 ${diaryInfo.content.length}자 (100자 이상 입력해야 합니다.)`
                  : `100자 넘었습니다. (현재 ${diaryInfo.content.length}자)`
            }
          />
        </div>
        <div className="flex-col gap-[1rem]">
          <p className="heading3-700 text-gray-900">공개 범위</p>
          <ToggleButton
            activeTab={diaryInfo.range}
            setActiveTab={(type) => setDiaryInfo((prev) => ({ ...prev, range: type }))}
            leftItem="친구 공개"
            rightItem="나만 보기"
          />
        </div>
      </div>
      <PrimaryStrongCTA
        onClick={handleOpen}
        disabled={!buttonActive}
        className={buttonActive ? '' : 'bg-gray-100 text-gary-500'}
      >
        작성 완료
      </PrimaryStrongCTA>

      <DiaryCompleteSheet
        isOpen={open}
        onClose={handleClose}
        onGoRecords={handleGoRecords}
        // onGoMain={handleGoMain}
      />
    </div>
  );
}
