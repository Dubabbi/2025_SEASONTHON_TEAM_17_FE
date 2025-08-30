import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import Button from '@components/button/button';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';

interface LeaveConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  className?: string;
}

export default function LeaveConfirmSheet({
  isOpen,
  onClose,
  onConfirm,
  confirmDisabled = true,
  className,
}: LeaveConfirmSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className={cn('px-[2.4rem] pb-[2.2rem]', className)}
    >
      <div className="flex-col gap-[1.6rem] pb-[4rem]">
        <h2 className="heading2-600 text-gray-900">정말로 탈퇴할까요?</h2>
        <p className="heading3-500 text-gray-600">
          탈퇴하면 마음:ON 내 모든 기록이 사라집니다
          <br />
          또한 삭제한 데이터는 복구가 어렵습니다
        </p>
      </div>
      <div className="flex-col-center gap-[0.8rem]">
        <PrimaryStrongCTA onClick={onClose} className="w-full">
          취소
        </PrimaryStrongCTA>

        <Button
          onClick={onConfirm}
          disabled={confirmDisabled}
          className={cn(
            'w-full bg-transparent py-[0.75rem] text-center',
            'body1-500 text-gray-400',
          )}
        >
          탈퇴하기
        </Button>
      </div>
    </BottomSheet>
  );
}
