export const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const END_POINT = {
  AUTH_ME: '/auth/me',
  AUTH_STATUS: '/auth/status',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_PROFILE_UPDATE: '/auth/profile',
} as const;

export const withBase = (path: string): string =>
  `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
