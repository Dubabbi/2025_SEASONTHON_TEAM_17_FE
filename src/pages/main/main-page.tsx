import { PrimaryCTA } from '@components/button/cta-button';
import Intro from '@components/intro';
import { useToast } from '@contexts/toast-context';

export default function MainPage() {
  const { showToast } = useToast();

  return (
    <div>
      <div className="heading1-700 flex-row-center py-6 text-primary-300">
        <p className="heading1-700 text-primary-300">메인 페이지</p>
      </div>

      <div className="flex-col-center gap-[2rem] p-[2rem]">
        <Intro />
        <PrimaryCTA onClick={() => showToast('토스트 테스트입니다!')}>토스트 띄우기</PrimaryCTA>
      </div>
    </div>
  );
}
