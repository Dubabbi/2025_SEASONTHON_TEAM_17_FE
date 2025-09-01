import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { GrayCTA, PrimaryStrongCTA } from '@components/button/cta-button';
import InputField from '@components/input-field';
import { cn } from '@libs/cn';
import { useEffect, useMemo, useRef, useState } from 'react';

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

type Availability = 'idle' | 'checking' | 'available' | 'unavailable';

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

  const lenValid = useMemo(() => {
    const len = current.trim().length;
    return len >= minLen && len <= maxLen;
  }, [current, minLen, maxLen]);

  const baseActive = useMemo(() => {
    if (typeof isActive === 'boolean') return isActive;
    return lenValid;
  }, [isActive, lenValid]);

  const [availability, setAvailability] = useState<Availability>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!checkAvailability) {
      setAvailability('idle');
      return;
    }
    const trimmed = current.trim();
    if (!trimmed || !lenValid) {
      setAvailability('idle');
      return;
    }

    setAvailability('checking');

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        const ok = await checkAvailability(trimmed);
        setAvailability(ok ? 'available' : 'unavailable');
      } catch {
        setAvailability('unavailable');
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [current, lenValid, checkAvailability, debounceMs]);

  const canSubmit = useMemo(() => {
    if (!baseActive) return false;
    if (!checkAvailability) return true;
    return availability === 'available';
  }, [baseActive, checkAvailability, availability]);

  const handleSubmit = () => {
    if (!onSubmit || !canSubmit) return;
    onSubmit(current.trim());
  };

  const hasInput = current.trim().length > 0;

  const variant: 'default' | 'error' | 'success' =
    (!lenValid && hasInput) || availability === 'unavailable'
      ? 'error'
      : availability === 'available'
        ? 'success'
        : 'default';

  const helperText =
    variant === 'error'
      ? !lenValid
        ? `${minLen}~${maxLen}자 이내로 입력해 주세요`
        : '이미 사용 중인 닉네임입니다.'
      : availability === 'checking'
        ? '중복 확인 중...'
        : availability === 'available'
          ? '사용 가능한 닉네임입니다.'
          : `${minLen}~${maxLen}자 이내의 닉네임을 작성해 주세요`;

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
