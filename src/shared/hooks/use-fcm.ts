// src/hooks/useFcm.ts
import { getFcmMessaging } from '@libs/firebase';
import { deleteToken, getToken, isSupported, type Messaging, onMessage } from 'firebase/messaging';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseFcmOptions = {
  vapidKey: string;
  swPath?: string;
  autoRequest?: boolean;
};
type NotificationData = { title: string; date: string };

const BASE64URL_RE = /^[A-Za-z0-9_-]+$/;

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
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const enablingRef = useRef(false);

  useEffect(() => {
    isSupported()
      .then(setSupported)
      .catch(() => setSupported(false));
  }, []);

  const ensureMessaging = useCallback(async () => {
    if (messagingRef.current) return messagingRef.current;
    const m = await getFcmMessaging();
    if (!m) return null;
    messagingRef.current = m;
    return m;
  }, []);

  const ensureServiceWorker = useCallback(async () => {
    const existing = await navigator.serviceWorker.getRegistration('/');
    if (existing) return existing;
    return navigator.serviceWorker.register(swPath, { scope: '/' });
  }, [swPath]);

  const enablePush = useCallback(async (): Promise<boolean> => {
    if (supported === false || enablingRef.current) return false;
    enablingRef.current = true;

    try {
      if (!vapidKey || !BASE64URL_RE.test(vapidKey)) {
        if (import.meta.env.DEV) {
          console.error('[fcm] VAPID 키 형식이 잘못되었습니다. (base64url 한 줄이어야 함)');
        }
        return false;
      }

      const p = await Notification.requestPermission();
      setPermission(p);
      if (p !== 'granted') return false;

      const m = await ensureMessaging();
      if (!m) return false;
      const swReg = await ensureServiceWorker();

      // 토큰 발급
      const t = await getToken(m, {
        vapidKey,
        serviceWorkerRegistration: swReg,
      }).catch((err) => {
        if (import.meta.env.DEV) console.error('[fcm] getToken 실패:', err);
        return null;
      });
      if (!t) return false;

      setToken(t);
      localStorage.setItem('fcm.token', t);

      unsubscribeRef.current?.();
      unsubscribeRef.current = onMessage(m, (payload) => {
        const now = new Date();
        setMessages((prev) => [
          {
            title: payload.notification?.title ?? '새 알림',
            date: now.toISOString().slice(0, 10).replace(/-/g, '.'),
          },
          ...prev,
        ]);
      });

      return true;
    } finally {
      enablingRef.current = false;
    }
  }, [supported, vapidKey, ensureMessaging, ensureServiceWorker]);

  useEffect(() => {
    if (!autoRequest || supported !== true) return;
    void enablePush();
  }, [autoRequest, supported, enablePush]);

  const disablePush = useCallback(async () => {
    const m = await ensureMessaging();
    if (!m) return;

    try {
      await deleteToken(m);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[fcm] deleteToken 실패:', err);
    }
    setToken(null);
    localStorage.removeItem('fcm.token');

    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  }, [ensureMessaging]);

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, []);

  return { supported, permission, token, messages, enablePush, disablePush };
}
