importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyA8kizjdq8hejhfImjRIbBEVpTzIgNQlhE',
  authDomain: 'widuy-875a5.firebaseapp.com',
  projectId: 'widuy-875a5',
  storageBucket: 'widuy-875a5.firebasestorage.app',
  messagingSenderId: '152255230731',
  appId: '1:152255230731:web:658920ab180f7e95d9a80e',
  measurementId: 'G-G0KC3BCVYJ',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(({ notification, data }) => {
  const title = notification?.title ?? data?.title ?? '알림';
  const body = notification?.body ?? data?.body ?? '';
  const icon = notification?.icon ?? '/logo-192.png';
  self.registration.showNotification(title, { body, icon, data });
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification?.data?.link ?? '/';
  e.waitUntil(self.clients.openWindow(url));
});
