import { BASE_URL, ENDPOINTS } from '@apis/constants/endpoints';
import LoginBg from '@assets/images/login-bg.png';
import { KakaoStartCTA } from '@components/button/cta-button';
import Intro from '@components/intro';
import { useCallback } from 'react';

export default function LoginPage() {
  const go = useCallback(() => {
    window.location.assign(`${BASE_URL}${ENDPOINTS.auth.login}`);
  }, []);

  return (
    <div className="fixed-layout inset-0 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${LoginBg})` }}
      />
      <main className="relative z-[1] h-full max-w-[43rem] flex-col-center gap-[10rem] px-[2.4rem]">
        <Intro />
        <KakaoStartCTA onClick={go} />
      </main>
    </div>
  );
}
