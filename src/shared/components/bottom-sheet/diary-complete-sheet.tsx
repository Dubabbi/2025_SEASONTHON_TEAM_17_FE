import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import Button from '@components/button/button';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';
import {
  DIARY_COMPLETE_COPY,
  DIARY_COMPLETE_SECONDARY,
  type DiaryCompleteVariant,
} from '@pages/diary/constants/diary-complete';

interface DiaryCompleteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 기록/분석 보러 가기 */
  onGoRecords: () => void;
  onGoMain?: () => void;
  className?: string;
  variant?: DiaryCompleteVariant;
}

export default function DiaryCompleteSheet({
  isOpen,
  onClose,
  onGoRecords,
  onGoMain,
  className,
  variant = 'extracted',
}: DiaryCompleteSheetProps) {
  const copy = DIARY_COMPLETE_COPY[variant];
  const secondaryLabel = DIARY_COMPLETE_SECONDARY.later;
  const secondaryOnClick = onGoMain ?? onClose;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className={cn('px-[2.4rem] pb-[2.2rem]', className)}
    >
      <div className="flex-col gap-[1.6rem] pb-[4rem]">
        <h2 className="heading2-700 text-gray-900">{copy.title}</h2>
        <p className="heading3-500 text-gray-600">{copy.desc}</p>
      </div>

      <div className="flex-col-center gap-[0.8rem]">
        <PrimaryStrongCTA labelClassName="heading2-700" onClick={onGoRecords} className="w-full">
          {copy.primary}
        </PrimaryStrongCTA>

        <Button
          onClick={secondaryOnClick}
          className={cn(
            'w-full bg-transparent py-[0.75rem] text-center',
            'body1-500 text-gray-400',
          )}
        >
          {secondaryLabel}
        </Button>
      </div>
    </BottomSheet>
  );
}
