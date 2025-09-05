import StepBase from '@pages/onboarding/components/step-base';
import type { StepProps } from '@pages/onboarding/types/step';

export default function Step2(props: StepProps) {
  return (
    <StepBase
      {...props}
      title={
        <>
          홈에서 나의 감정 분석을
          <br />
          객관적으로 확인할 수 있어요
        </>
      }
    />
  );
}
