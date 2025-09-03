import { getFcmMessaging } from '@libs/firebase';
import { deleteToken, getToken, onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';

type UseFcmOptions = { vapidKey: string };
type NotificationData = { title: string; date: string };

export default function useFcm({ vapidKey }: UseFcmOptions) {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<NotificationData[]>([]);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const messaging = await getFcmMessaging();
      if (!messaging) return;

      const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      });
      const t = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swReg,
      });
      if (t) setToken(t);

      unsub = onMessage(messaging, (payload) => {
        const now = new Date();
        setMessages((prev) => [
          {
            title: payload.notification?.title ?? '새 알림',
            date: now.toISOString().slice(0, 10).replace(/-/g, '.'),
          },
          ...prev,
        ]);
      });
    })();

    return () => {
      unsub?.();
    };
  }, [vapidKey]);

  const resetToken = async () => {
    const messaging = await getFcmMessaging();
    if (!messaging) return;
    await deleteToken(messaging);
    setToken(null);
  };

  return { token, resetToken, messages };
}
