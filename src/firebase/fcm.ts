import { getFcmMessaging } from '@libs/firebase';
import { deleteToken, getToken, isSupported } from 'firebase/messaging';

const BASE64URL_RE = /^[A-Za-z0-9_-]+$/;

export async function requestFCMToken(
  vapidKey = import.meta.env.VITE_FCM_VAPID_KEY as string,
  swPath = '/firebase-messaging-sw.js',
  scope = '/fcm',
): Promise<string | null> {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return null;
  if (!(await isSupported())) return null;
  if (!vapidKey || !BASE64URL_RE.test(vapidKey)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const m = await getFcmMessaging();
  if (!m) return null;

  const reg =
    (await navigator.serviceWorker.getRegistration(scope)) ??
    (await navigator.serviceWorker.register(swPath, { scope }));

  try {
    const token = await getToken(m, {
      vapidKey,
      serviceWorkerRegistration: reg,
    });
    return token;
  } catch (err) {
    try {
      await deleteToken(m);
    } catch {
      /* */
    }
    throw err;
  }
}
