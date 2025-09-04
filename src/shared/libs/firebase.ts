import {
  type FirebaseApp,
  type FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

function readFirebaseOptions(): FirebaseOptions | null {
  const E = import.meta.env as Record<string, string | undefined>;
  const cfg: FirebaseOptions = {
    apiKey: E.VITE_FIREBASE_API_KEY,
    authDomain: E.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: E.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: E.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: E.VITE_FIREBASE_APP_ID,
  };
  if (!cfg.apiKey || !cfg.projectId || !cfg.messagingSenderId || !cfg.appId) {
    if (import.meta.env.DEV) {
      console.warn('[firebase] Missing env:', {
        apiKey: !!cfg.apiKey,
        projectId: !!cfg.projectId,
        messagingSenderId: !!cfg.messagingSenderId,
        appId: !!cfg.appId,
      });
    }
    return null;
  }
  return cfg;
}

let _app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (_app) return _app;
  const cfg = readFirebaseOptions();
  if (!cfg) return null; // env 미설정이면 앱을 만들지 않도록
  _app = getApps().length ? getApp() : initializeApp(cfg);
  return _app;
}

export async function getFcmMessaging(): Promise<Messaging | undefined> {
  const supported = await isSupported().catch(() => false);
  if (!supported) return undefined;

  const app = getFirebaseApp();
  if (!app) return undefined;
  return getMessaging(app);
}
