import DiaryCompleteSheet from '@components/bottom-sheet/diary-complete-sheet';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import InputField from '@components/inputfield';
import TextField from '@components/textfield';
import type { DiaryEntry } from '@pages/diary/diary-page';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type DiaryCreateState =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; date: string; entry: DiaryEntry };

export default function DiaryCreatePage() {
  const { state } = useLocation() as { state?: DiaryCreateState };
  const mode = state?.mode ?? 'create';
  const date = state?.date ?? '';
  const initial = useMemo(
    () =>
      mode === 'edit' && state && 'entry' in state
        ? {
            title: state.entry.title,
            emotions: state.entry.emotions.join(', '),
            content: state.entry.content,
          }
        : { title: '', emotions: '', content: '' },
    [mode, state],
  );

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial.title);
  const [emotions, setEmotions] = useState(initial.emotions);
  const [content, setContent] = useState(initial.content);

  useEffect(() => {
    setTitle(initial.title);
    setEmotions(initial.emotions);
    setContent(initial.content);
  }, [initial]);

  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGoRecords = () => {
    setOpen(false);
  };

  const handleGoMain = () => {
    navigate('/diary');
    setOpen(false);
  };

  const ctaLabel = mode === 'edit' ? '수정 완료' : '작성 완료';

  return (
    <div className="flex-col gap-[5rem] px-[2.5rem] pt-[2.2rem] pb-[20rem]">
      <div className="flex-col gap-[2rem]">
        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">제목</span>
          <InputField
            placeholder="제목을 입력해 주세요 (최대 100자 이내)"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">오늘의 감정</span>
          <InputField
            placeholder="감정을 아래에서 선택하거나 직접 입력해 주세요 (쉼표로 구분)"
            value={emotions}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmotions(e.target.value)}
          />
        </div>

        <div className="flex-col gap-[1rem]">
          <span className="heading3-700 text-gray-900">내용</span>
          <TextField
            placeholder="일기 내용을 입력해 주세요"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          />
        </div>

        {date && <div className="detail text-gray-500">{date}</div>}
      </div>

      <PrimaryStrongCTA onClick={handleOpen}>{ctaLabel}</PrimaryStrongCTA>

      <DiaryCompleteSheet
        isOpen={open}
        onClose={handleClose}
        onGoRecords={handleGoRecords}
        onGoMain={handleGoMain}
      />
    </div>
  );
}
