import { deleteToken, getToken, isSupported } from 'firebase/messaging';
import { messaging } from './firebase';

export async function requestFCMToken() {
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
  } catch (e) {
    console.error('getToken 실패, 기존 토큰 삭제 후 재시도:', e);
    try {
      await deleteToken(messaging);
    } catch {
      /* */
    }
    throw e;
  }
}
