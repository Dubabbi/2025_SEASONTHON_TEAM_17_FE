import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { ErrorCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';

interface LogoutConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  className?: string;
}

export default function LogoutConfirmSheet({
  isOpen,
  onClose,
  onLogout,
  className,
}: LogoutConfirmSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className={cn('px-[2rem] pb-[2.4rem]', className)}
    >
      <div className="flex-col-center gap-[1.2rem] pt-[1.6rem]">
        <h2 className="heading2-700 text-gray-900">정말 로그아웃할까요?</h2>
        <p className="text-center text-[1.6rem] text-gray-600 leading-[2.4rem]">
          다음 로그인을 할 때 카카오 로그인해 주세요
        </p>
      </div>

      <div className="grid w-full flex-row-around grid-cols-2 gap-[2.5rem]">
        <ErrorCTA
          onClick={onClose}
          className="heading2-600 bg-gray-50 text-error-default outline outline-error-default"
        >
          취소
        </ErrorCTA>
        <ErrorCTA onClick={onLogout} labelClassName="heading2-600">
          로그아웃
        </ErrorCTA>
      </div>
    </BottomSheet>
  );
}
