import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { GrayCTA, PrimaryStrongCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';
import { useMemo, useState } from 'react';

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
}: NicknameChangeSheetProps) {
  const [inner, setInner] = useState('');
  const current = value ?? inner;

  const handleChange = (v: string) => {
    onChange ? onChange(v) : setInner(v);
  };

  const active = useMemo(() => {
    if (typeof isActive === 'boolean') return isActive;
    const len = current.trim().length;
    return len >= minLen && len <= maxLen;
  }, [isActive, current, minLen, maxLen]);

  const handleSubmit = () => {
    if (!onSubmit) return;
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
        {/* TODO: 인풋 필드 컴포넌트로 대체 */}
        {inputSlot ?? (
          <div className="flex-col gap-[0.8rem]">
            <div className="flex h-[5.6rem] items-center rounded-[12px] border border-gray-300 bg-gray-white px-[1.6rem]">
              <input
                value={current}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="닉네임을 입력해 주세요"
                className="body1-500 w-full bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                maxLength={maxLen}
              />
            </div>

            <p className="body2-500 text-gray-500">
              {minLen}~{maxLen}자 이내의 닉네임을 작성해 주세요
            </p>
          </div>
        )}
      </div>

      <div className="pt-[4rem]">
        {active ? (
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
