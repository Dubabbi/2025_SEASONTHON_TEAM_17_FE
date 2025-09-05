import { authMutations } from '@apis/auth/auth-mutations';
import { useMutation } from '@tanstack/react-query';
import { setAccessToken, setRefreshToken } from '@utils/token';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoCallbackPage() {
  const nav = useNavigate();
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
      nav('/', { replace: true });
    })().catch(() => nav('/login', { replace: true }));
  }, [mutateAsync, nav]);

  return null;
}
