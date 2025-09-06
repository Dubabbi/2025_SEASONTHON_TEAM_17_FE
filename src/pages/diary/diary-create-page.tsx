import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import InputField from '@components/inputfield';
import TextField from '@components/textfield';
import Loading from '@pages/diary/components/loading';
import ToggleButton from '@pages/diary/components/toggle-button';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DiaryCreatePage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diaryInfo, setDiaryInfo] = useState({
    title: '',
    content: '',
    range: '',
  });
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    navigate('/diary');
    setOpen(false);
  };
  const { state } = useLocation();

  const buttonActive =
    diaryInfo.title.length < 100 && diaryInfo.content.length >= 100 && diaryInfo.range;

  const handleGoRecords = () => {
    // TODO: mutate function 처리할때 loading 처리
    setIsLoading(true);
    setOpen(false);
  };

  useEffect(() => {
    if (state && state.mode === 'edit' && state.entry) {
      setDiaryInfo((prev) => ({
        ...prev,
        title: state.entry.title,
        content: state.entry.content,
      }));
    }
  }, [state]);

  useEffect(() => {
    if (isLoading) {
      // 로딩 임시처리, 추후 api 연결시 api에 맞춰 변경
      setTimeout(() => {
        navigate('/diary/result');
      }, 1000);
    }
  }, [isLoading, navigate]);

  if (isLoading) return <Loading />;

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

      <DiaryCompleteSheet isOpen={open} onClose={handleClose} onGoRecords={handleGoRecords} />
    </div>
  );
}
