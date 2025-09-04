export const FCM_KEYS = {
  VAPID: import.meta.env.VITE_FIREBASE_VAPID_KEY, // TODO: 추후 env에 등록
} as const;

export const STORAGE = {
  FCM_TOKEN: 'fcm.token',
  FCM_PERMISSION: 'fcm.permission',
} as const;
