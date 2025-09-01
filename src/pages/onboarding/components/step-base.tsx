import { MaeumStartCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';
import type { StepProps } from '@pages/onboarding/types/step';
import type { ReactNode } from 'react';

type StepBaseProps = StepProps & {
  title: ReactNode;
  ctaText?: string;
  className?: string;
};

export default function StepBase({
  title,
  onStart,
  onLogin,
  ctaText = '마음:ON 시작하기',
  className,
}: StepBaseProps) {
  return (
    <div className={cn('text-center', className)}>
      <h2 className={cn('sub-heading1 pb-[8.4rem] text-gray-900 leading-tight')}>{title}</h2>

      <MaeumStartCTA className="w-full" onClick={onStart}>
        {ctaText}
      </MaeumStartCTA>

      <p className="body2-500 pt-[2rem] pb-[4rem] text-gray-400">
        이미 계정이 있다면?
        <button
          type="button"
          className="text-primary-600 underline-offset-2 hover:underline"
          onClick={onLogin}
        >
          로그인하기
        </button>
      </p>
    </div>
  );
}
