import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyA0wy6oq21VSzc3PISVs8z-p03Te5n04hA',
  authDomain: 'maeum-on.firebaseapp.com',
  projectId: 'maeum-on',
  storageBucket: 'maeum-on.firebasestorage.app',
  messagingSenderId: '853076092029',
  appId: '1:853076092029:web:d6d05b1b76dc390364bd14',
  measurementId: 'G-BV704Y1LP1',
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
