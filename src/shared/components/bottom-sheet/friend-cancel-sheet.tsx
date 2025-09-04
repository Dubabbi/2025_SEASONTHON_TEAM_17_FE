import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import Button from '@components/button/button';
import { PrimaryCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
};

export default function FriendCancelSheet({ open, onClose, onConfirm, className }: Props) {
  return (
    <BottomSheet
      isOpen={open}
      onClose={onClose}
      className={cn('px-[2.4rem] pb-[2.2rem]', className)}
    >
      <h2 className="heading2-600 pb-[4rem] text-left text-gray-900">
        정말로 친구 취소하시겠습니까?
      </h2>
      <div className="flex-col-center gap-[0.8rem]">
        <PrimaryCTA className="heading2-800 w-full bg-error-default" onClick={onConfirm}>
          친구 취소하기
        </PrimaryCTA>
        <Button
          type="button"
          onClick={onClose}
          className="body2-500 mx-auto py-[0.75rem] text-gray-400"
        >
          닫기
        </Button>
      </div>
    </BottomSheet>
  );
}
