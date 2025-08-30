import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { GrayCTA, PrimaryStrongCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';

interface NicknameChangeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  inputSlot?: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export default function NicknameChangeSheet({
  isOpen,
  onClose,
  onSubmit,
  inputSlot,
  className,
  isActive = false,
}: NicknameChangeSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className={cn('px-[2.4rem] pb-[2.2rem]', className)}
    >
      <div className="flex-col gap-[1.6rem]">
        <h2 className="heading2-700 text-gray-900">변경할 닉네임을 입력해 주세요</h2>

        {inputSlot ?? (
          <div className="flex flex-col gap-[0.8rem]">
            <div
              className={cn(
                'flex h-[5.6rem] items-center justify-between rounded-[12px] px-[1.6rem]',
                'border border-gray-300 bg-gray-white',
              )}
            >
              <span className="body1-500 text-gray-400">닉네임을 입력해 주세요</span>
              <div className="h-[2.4rem] w-[2.4rem] rounded-[6px] bg-gray-100" />
            </div>

            <p className="body2-500 text-gray-500">2~10자 이내의 닉네임을 작성해 주세요</p>
          </div>
        )}
      </div>

      <div className="mt-[3.2rem]">
        {isActive ? (
          <PrimaryStrongCTA onClick={onSubmit} className="w-full" labelClassName="heading1-700">
            닉네임 변경하기
          </PrimaryStrongCTA>
        ) : (
          <GrayCTA disabled onClick={onSubmit} className="w-full" labelClassName="heading1-700">
            닉네임 변경하기
          </GrayCTA>
        )}
      </div>
    </BottomSheet>
  );
}
