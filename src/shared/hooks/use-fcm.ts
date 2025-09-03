import { getFcmMessaging } from '@libs/firebase';
import { deleteToken, getToken, isSupported, type Messaging, onMessage } from 'firebase/messaging';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseFcmOptions = {
  vapidKey: string;
  swPath?: string;
  autoRequest?: boolean;
};
type NotificationData = { title: string; date: string };

export default function useFcm({
  vapidKey,
  swPath = '/firebase-messaging-sw.js',
  autoRequest = false,
}: UseFcmOptions) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  const [token, setToken] = useState<string | null>(localStorage.getItem('fcm.token'));
  const [messages, setMessages] = useState<NotificationData[]>([]);
  const messagingRef = useRef<Messaging | null>(null);
  const listenerSetRef = useRef(false);

  useEffect(() => {
    isSupported()
      .then(setSupported)
      .catch(() => setSupported(false));
  }, []);

  const ensureMessaging = useCallback(async () => {
    const m = await getFcmMessaging();
    if (!m) return null;
    messagingRef.current = m;
    return m;
  }, []);

  const enablePush = useCallback(async (): Promise<boolean> => {
    if (supported === false) return false;

    const p = await Notification.requestPermission();
    setPermission(p);
    if (p !== 'granted') return false;

    const m = await ensureMessaging();
    if (!m) return false;

    const swReg = await navigator.serviceWorker.register(swPath, {
      scope: '/',
    });
    const t = await getToken(m, {
      vapidKey,
      serviceWorkerRegistration: swReg,
    }).catch(() => null);
    if (!t) return false;

    setToken(t);
    localStorage.setItem('fcm.token', t);

    if (!listenerSetRef.current) {
      onMessage(m, (payload) => {
        const now = new Date();
        setMessages((prev) => [
          {
            title: payload.notification?.title ?? '새 알림',
            date: now.toISOString().slice(0, 10).replace(/-/g, '.'),
          },
          ...prev,
        ]);
      });
      listenerSetRef.current = true;
    }
    return true;
  }, [supported, swPath, vapidKey, ensureMessaging]);

  useEffect(() => {
    if (!autoRequest || supported !== true) return;
    void enablePush();
  }, [autoRequest, supported, enablePush]);

  const disablePush = async () => {
    const m = await ensureMessaging();
    if (!m) return;
    await deleteToken(m).catch((err) => {
      if (import.meta.env.DEV) console.warn('[fcm] deleteToken failed:', err);
    });
    setToken(null);
    localStorage.removeItem('fcm.token');
  };

  return { supported, permission, token, messages, enablePush, disablePush };
}
