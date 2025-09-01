import type { Availability } from '@pages/my-page/types/nickname';
import { useEffect, useMemo, useRef, useState } from 'react';

type CheckFn = (nickname: string) => Promise<boolean> | boolean;

export function useNicknameAvailability(props: {
  nickname: string;
  minLen?: number;
  maxLen?: number;
  isActive?: boolean;
  checkAvailability?: CheckFn;
  debounceMs?: number;
}) {
  const {
    nickname,
    minLen = 2,
    maxLen = 10,
    isActive,
    checkAvailability,
    debounceMs = 300,
  } = props;

  const trimmed = nickname.trim();
  const hasInput = trimmed.length > 0;

  const lenValid = useMemo(() => {
    const len = trimmed.length;
    return len >= minLen && len <= maxLen;
  }, [trimmed, minLen, maxLen]);

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
  }, [trimmed, lenValid, checkAvailability, debounceMs]);

  const canSubmit = useMemo(() => {
    if (!baseActive) return false;
    if (!checkAvailability) return true;
    return availability === 'available';
  }, [baseActive, checkAvailability, availability]);

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

  return {
    hasInput,
    lenValid,
    availability,
    canSubmit,
    variant,
    helperText,
  };
}

export type { Availability };
