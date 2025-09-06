// src/components/bottom-sheet/delete-confirm-sheet.tsx
import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import Button from '@components/button/button';
import { PrimaryStrongCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';

interface DeleteConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  className?: string;
}

export default function DeleteConfirmSheet({
  isOpen,
  onClose,
  onConfirm,
  confirmDisabled = false,
  className,
}: DeleteConfirmSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className={cn('px-[2.4rem] pb-[2.2rem]', className)}
    >
      <div className="flex-col gap-[1.6rem] pb-[4rem]">
        <h2 className="heading2-600 text-gray-900">정말로 삭제할까요?</h2>
        <p className="heading3-500 text-gray-600">
          삭제하면 작성한 감정 일기가 사라집니다
          <br />
          또한 삭제한 데이터는 복구가 어렵습니다
        </p>
      </div>
      <div className="flex-col-center gap-[0.8rem]">
        <PrimaryStrongCTA onClick={onConfirm} disabled={confirmDisabled} className="w-full">
          삭제
        </PrimaryStrongCTA>
        <Button
          onClick={onClose}
          className={cn(
            'w-full bg-transparent py-[0.75rem] text-center',
            'body1-500 text-gray-400',
          )}
        >
          취소하기
        </Button>
      </div>
    </BottomSheet>
  );
}
