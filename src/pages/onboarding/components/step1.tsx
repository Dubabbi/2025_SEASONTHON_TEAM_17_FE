import StepBase from '@pages/onboarding/components/step-base';
import type { StepProps } from '@pages/onboarding/types/step';

export default function Step1(props: StepProps) {
  return (
    <StepBase
      {...props}
      title={
        <>
          감정 일기로
          <br />
          나의 속마음을 털어내보세요
        </>
      }
    />
  );
}
