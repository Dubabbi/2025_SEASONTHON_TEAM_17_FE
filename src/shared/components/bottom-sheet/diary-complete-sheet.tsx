import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import Button from '@components/button/button';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';

interface DiaryCompleteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 기록 보러 가기 */
  onGoRecords: () => void;
  /** 메인 이동 */
  onGoMain?: () => void;
  className?: string;
}

export default function DiaryCompleteSheet({
  isOpen,
  onClose,
  onGoRecords,
  onGoMain,
  className,
}: DiaryCompleteSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className={cn('px-[2.4rem] pb-[2.2rem]', className)}
    >
      <div className="flex-col gap-[1.6rem] pb-[4rem]">
        <h2 className="heading2-700 text-gray-900">작성을 완료했습니다.</h2>
        <p className="heading3-500 text-gray-600">
          지금 작성한 내용에 대해 마몬이가 공감 멘트와 감정 5개를 추출했어요. 확인해보시겠어요?
        </p>
      </div>

      <div className="flex-col-center gap-[0.8rem]">
        <PrimaryStrongCTA labelClassName="heading2-700" onClick={onGoRecords} className="w-full">
          나의 감정 일기 기록 보러 가기
        </PrimaryStrongCTA>

        <Button
          onClick={onGoMain}
          className={cn(
            'w-full bg-transparent py-[0.75rem] text-center',
            'body1-500 text-gray-400',
          )}
        >
          일기 메인 페이지로 이동
        </Button>
      </div>
    </BottomSheet>
  );
}
