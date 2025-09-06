import { useToast } from '@contexts/toast-context';
import { getFcmMessaging } from '@libs/firebase';
import { onMessage } from 'firebase/messaging';
import { useEffect } from 'react';

export default function FcmForeground() {
  const { showToast } = useToast();

  useEffect(() => {
    let unsub: (() => void) | null = null;

    (async () => {
      const m = await getFcmMessaging();
      if (!m || Notification.permission !== 'granted') return;

      unsub = onMessage(m, (p) => {
        const title = p.notification?.title ?? p.data?.title ?? '알림';
        const body = p.notification?.body ?? p.data?.body ?? '';
        if (document.visibilityState === 'visible') {
          showToast(`${title}\n${body}`);
        }
      });
    })();

    return () => unsub?.();
  }, [showToast]);

  return null;
}
