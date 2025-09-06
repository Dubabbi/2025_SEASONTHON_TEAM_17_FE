import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/http';

const http = new HttpClient(axiosInstance);

export type TokenPair = { accessToken: string; refreshToken: string };
export type MemberInfo = { id: string; email: string; role: string };

export const authApi = {
  getKakaoLoginUrl: () => `${ENDPOINTS.auth.login}`,
  kakaoCallback: (code: string) =>
    http.get<Rsp<TokenPair>>(ENDPOINTS.auth.kakaoCallback, {
      params: { code },
    }),

  verify: () => http.get<MemberInfo>(ENDPOINTS.test.verify),
  getNotifications: () =>
    http.get<{
      notifications: { id: number; body: string; createdAt: string }[];
    }>(ENDPOINTS.fcm.notifications),

  saveFcmToken: (body: { token: string; deviceInfo?: string }) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.fcm.tokenLogin, body),

  disableFcmToken: (body: { token: string }) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.fcm.tokenLogout, body),
};
