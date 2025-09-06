importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyA0wy6oq21VSzc3PISVs8z-p03Te5n04hA',
  authDomain: 'maeum-on.firebaseapp.com',
  projectId: 'maeum-on',
  storageBucket: 'maeum-on.firebasestorage.app',
  messagingSenderId: '853076092029',
  appId: '1:853076092029:web:d6d05b1b76dc390364bd14',
  measurementId: 'G-BV704Y1LP1',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png', // 아이콘 이미지 경로
  });
});
