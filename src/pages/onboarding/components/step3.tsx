import StepBase from '@pages/onboarding/components/step-base';
import type { StepProps } from '@pages/onboarding/types/step';

export default function Step3(props: StepProps) {
  return (
    <StepBase
      {...props}
      title={
        <>
          친구의 감정 일기도 들어가
          <br />
          친구의 감정을 확인해보세요
        </>
      }
    />
  );
}
