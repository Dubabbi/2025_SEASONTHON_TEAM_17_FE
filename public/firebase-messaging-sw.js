/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js',
);

(function () {
  const cfg = {
    apiKey: self.env?.VITE_FIREBASE_API_KEY,
    authDomain: self.env?.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: self.env?.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: self.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: self.env?.VITE_FIREBASE_APP_ID,
  };
  if (!cfg.apiKey || !cfg.messagingSenderId || !cfg.appId) return;

  firebase.initializeApp(cfg);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title ?? '새 알림';
    const body = payload.notification?.body ?? '';
    const url = payload.data?.url || '/';

    self.registration.showNotification(title, {
      body,
      icon: '/logo-192.png',
      data: { url },
    });
  });
})();

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((wins) => {
        const target = wins.find((w) => w.url.startsWith(self.location.origin));
        if (target) {
          const dest = new URL(url, self.location.origin).href;
          if (target.url !== dest && 'navigate' in target) {
            return target.navigate(dest).then(() => target.focus());
          }
          return target.focus();
        }
        return clients.openWindow(url);
      }),
  );
});
