import { MaeumStartCTA } from '@components/button/cta-button';
import type { StepProps } from '@pages/onboarding/types/step';

export default function Step3({ onStart, onLogin }: StepProps) {
  return (
    <div className="text-center">
      <h2 className="heading2-700 text-gray-900 leading-tight">
        위기 키워드 발생시
        <br />
        자동 알림이 가게 돼요
      </h2>

      <div className="mt-[2.4rem]">
        <MaeumStartCTA className="w-full" onClick={onStart}>
          마음:ON 시작하기
        </MaeumStartCTA>
      </div>

      <p className="body2-500 mt-[1.2rem] text-gray-400">
        이미 계정이 있다면?{' '}
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
