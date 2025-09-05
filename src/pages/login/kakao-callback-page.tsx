import { authMutations } from '@apis/auth/auth-mutations';
import { useToast } from '@contexts/toast-context';
import { useMutation } from '@tanstack/react-query';
import { setAccessToken, setRefreshToken } from '@utils/token';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoCallbackPage() {
  const nav = useNavigate();
  const { showToast } = useToast();
  const { mutateAsync } = useMutation(authMutations.kakaoCallback());
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const sp = new URLSearchParams(window.location.search);
    const code = sp.get('code');
    if (!code) {
      nav('/login', { replace: true });
      return;
    }

    window.history.replaceState({}, '', '/login/callback');

    (async () => {
      const r = await mutateAsync(code);
      setAccessToken(r.data.accessToken);
      setRefreshToken?.(r.data.refreshToken);
      showToast('로그인에 성공했어요!');
      nav('/', { replace: true });
    })().catch(() => nav('/login', { replace: true }));
  }, [mutateAsync, nav, showToast]);

  return null;
}
