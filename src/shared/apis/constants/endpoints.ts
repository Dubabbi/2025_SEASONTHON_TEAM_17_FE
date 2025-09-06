export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    kakaoCallback: '/api/v1/auth/code/kakao',
  },
  fcm: {
    tokenLogin: '/api/v1/fcm/token/login',
    tokenLogout: '/api/v1/fcm/token/logout',
    notifications: '/api/v1/fcm',
  },
  diaries: {
    root: '/api/v1/diaries',
    byId: (diaryId: number | string) => `/api/v1/diaries/${diaryId}`,
    today: '/api/v1/diaries/today',
    month: '/api/v1/diaries/month',
    date: '/api/v1/diaries/date',
  },
  emotions: {
    like: (emotionId: number | string) => `/api/v1/emotions/${emotionId}/like`,
  },
  friends: {
    root: '/api/v1/friends',
    request: '/api/v1/friends/request',
    accept: '/api/v1/friends/accept',
    reject: '/api/v1/friends/reject',
    cancel: '/api/v1/friends/cancel',
    sent: '/api/v1/friends/sent',
    received: '/api/v1/friends/received',
    searchAll: '/api/v1/friends/search',
    searchSent: '/api/v1/friends/search/sent',
    searchReceived: '/api/v1/friends/search/received',
    searchMy: '/api/v1/friends/search/my-friends',
  },
  test: {
    verify: '/api/v1/test/verify',
    token: '/api/v1/test/token',
  },
} as const;
