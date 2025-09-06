import { useToast } from '@contexts/toast-context';
import { deleteToken, getToken, isSupported } from 'firebase/messaging';
import { messaging } from './firebase';

export async function requestFCMToken() {
  const { showToast } = useToast();
  if (!(await isSupported())) {
    console.warn('FCM 미지원 브라우저');
    return null;
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('알림 권한 거부');
    return null;
  }

  const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });

  const VAPID = import.meta.env.VITE_FCM_VAPID_KEY as string;

  try {
    const token = await getToken(messaging, {
      vapidKey: VAPID,
      serviceWorkerRegistration: swReg,
    });
    return token;
  } catch {
    showToast('getToken 실패, 기존 토큰 삭제 후 재시도');
    try {
      await deleteToken(messaging);
    } catch {
      /* */
    }
  }
}
