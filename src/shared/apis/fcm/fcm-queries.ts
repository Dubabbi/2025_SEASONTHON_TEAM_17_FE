import { BASE_URL, ENDPOINTS } from '@apis/constants/endpoints';
import { buildQuery } from '@apis/factory';

type FcmNotificationDto = {
  id: number;
  body: string;
  createdAt: string;
};

type FcmListResponse = {
  statusCode: number;
  message: string;
  data: { notifications: FcmNotificationDto[] };
};

const resolveAccessToken = () => localStorage.getItem('access_token');

export const fcmQueries = {
  notifications: () =>
    buildQuery<FcmNotificationDto[]>(
      ['fcm', 'notifications'],
      async () => {
        const token = resolveAccessToken();
        const res = await fetch(`${BASE_URL}${ENDPOINTS.fcm.notifications}`, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('failed to fetch notifications');
        const json: FcmListResponse = await res.json();
        return json.data?.notifications ?? [];
      },
      { staleTime: 10_000 },
    ),
};
