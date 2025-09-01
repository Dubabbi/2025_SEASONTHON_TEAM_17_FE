import StepBase from '@pages/onboarding/components/step-base';
import type { StepProps } from '@pages/onboarding/types/step';

export default function Step1(props: StepProps) {
  return (
    <StepBase
      {...props}
      title={
        <>
          오늘의 감정 체크로
          <br />
          오늘의 감정을 체크해보세요
        </>
      }
    />
  );
}
