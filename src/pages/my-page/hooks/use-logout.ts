import { authApi } from '@apis/auth/auth';
import { axiosInstance } from '@apis/base/instance';
import useFcm from '@hooks/use-fcm';
import { unsyncFcmFromServer } from '@pages/my-page/utils/fcm-sync';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const LOGOUT_BROADCAST_KEY = '__maeum:logout__';

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export default function useLogout() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { disablePush, token } = useFcm({
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    autoRequest: false,
  });

  return async () => {
    try {
      if (token) await authApi.disableFcmToken({ token }).catch(() => {});
      await unsyncFcmFromServer();
      await disablePush().catch(() => {
        /* */
      });
    } finally {
      clearTokens();
      axiosInstance.defaults.headers.common.Authorization = '';
      qc.clear();
      try {
        // @ts-expect-error
        window?.Kakao?.Auth?.logout?.(() => {
          /* */
        });
        // @ts-expect-error
        window?.Kakao?.Auth?.setAccessToken?.(null);
      } catch {
        /* */
      }
      localStorage.setItem(LOGOUT_BROADCAST_KEY, String(Date.now()));
      nav('/login', { replace: true });
    }
  };
}

export const useLogoutBroadcast = () => {
  const nav = useNavigate();
  return () => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOGOUT_BROADCAST_KEY) nav('/login', { replace: true });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  };
};
