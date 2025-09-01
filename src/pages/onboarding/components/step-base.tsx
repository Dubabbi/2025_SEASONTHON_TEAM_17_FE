import Button from '@components/button/button';
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
    <div className={cn('space-y-[8.4rem] text-center', className)}>
      <h2 className={cn('sub-heading1 text-gray-900')}>{title}</h2>
      <div className="flex-col gap-[2rem] pb-[4rem]">
        <MaeumStartCTA className="w-full" onClick={onStart}>
          {ctaText}
        </MaeumStartCTA>
        <div className="flex-row-center gap-[1rem] px-[2rem] py-[0.75rem]">
          <p className="body2-500 text-gray-400">이미 계정이 있다면?</p>
          <Button
            className="body2-600 text-primary-600 underline-offset-2 hover:underline"
            onClick={onLogin}
          >
            로그인하기
          </Button>
        </div>
      </div>
    </div>
  );
}
