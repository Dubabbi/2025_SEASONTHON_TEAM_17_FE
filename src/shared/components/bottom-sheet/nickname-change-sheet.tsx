import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { GrayCTA, PrimaryStrongCTA } from '@components/button/cta-button';
import InputField from '@components/inputfield';
import { cn } from '@libs/cn';
import { useNicknameAvailability } from '@pages/my-page/hooks/use-nickname-availability';
import { useState } from 'react';

interface NicknameChangeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 제출 시 이름을 넘김 */
  onSubmit?: (nickname: string) => void;
  value?: string;
  onChange?: (v: string) => void;
  inputSlot?: React.ReactNode;
  isActive?: boolean;
  minLen?: number;
  maxLen?: number;
  className?: string;
  checkAvailability?: (nickname: string) => Promise<boolean> | boolean;
  debounceMs?: number;
}

export default function NicknameChangeSheet({
  isOpen,
  onClose,
  onSubmit,
  value,
  onChange,
  inputSlot,
  isActive,
  minLen = 2,
  maxLen = 10,
  className,
  checkAvailability,
  debounceMs = 300,
}: NicknameChangeSheetProps) {
  const [inner, setInner] = useState('');
  const current = value ?? inner;

  const handleChange = (v: string) => {
    onChange ? onChange(v) : setInner(v);
  };

  const { canSubmit, variant, helperText, availability } = useNicknameAvailability({
    nickname: current,
    minLen,
    maxLen,
    isActive,
    checkAvailability,
    debounceMs,
  });

  const handleSubmit = () => {
    if (!onSubmit || !canSubmit) return;
    onSubmit(current.trim());
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className={cn('px-[2.4rem] pb-[4.2rem]', className)}
    >
      <div className="flex-col gap-[1.6rem]">
        <h2 className="heading2-700 text-gray-900">변경할 닉네임을 입력해 주세요</h2>

        {inputSlot ?? (
          <InputField
            value={current}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="닉네임을 입력해 주세요"
            maxLength={maxLen}
            variant={variant}
            helperText={helperText}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) handleSubmit();
            }}
            aria-busy={availability === 'checking' || undefined}
          />
        )}
      </div>

      <div className="pt-[4rem]">
        {canSubmit ? (
          <PrimaryStrongCTA className="w-full" labelClassName="heading2-700" onClick={handleSubmit}>
            닉네임 변경하기
          </PrimaryStrongCTA>
        ) : (
          <GrayCTA className="w-full" labelClassName="heading2-700" disabled onClick={handleSubmit}>
            닉네임 변경하기
          </GrayCTA>
        )}
      </div>
    </BottomSheet>
  );
}
