import StepBase from '@pages/onboarding/components/step-base';
import type { StepProps } from '@pages/onboarding/types/step';

export default function Step3(props: StepProps) {
  return (
    <StepBase
      {...props}
      title={
        <>
          위기 키워드 발생 시
          <br />
          자동 알림이 가게 돼요
        </>
      }
    />
  );
}
