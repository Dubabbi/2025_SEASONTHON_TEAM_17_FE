importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'YOUR_API_KEY', // TODO: 추후 추가
  authDomain: 'YOUR_AUTH_DOMAIN', // TODO: 추후 추가
  projectId: 'YOUR_PROJECT_ID', // TODO: 추후 추가
  messagingSenderId: 'YOUR_SENDER_ID', // TODO: 추후 추가
  appId: 'YOUR_APP_ID', // TODO: 추후 추가
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(({ notification, data }) => {
  const title = notification?.title ?? '알림';
  const options = {
    body: notification?.body ?? '',
    icon: '/logo-192.png',
    data: { url: data?.url || '/' },
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((wins) => {
        const focused = wins.find((w) => w.url.includes(self.location.origin));
        if (focused) return focused.focus();
        return clients.openWindow(url);
      }),
  );
});
