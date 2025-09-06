import { authApi } from '@apis/auth/auth';
import { QK } from '@apis/constants/keys';
import { buildQuery } from '@apis/factory';

export const authQueries = {
  verify: () => buildQuery(QK.auth.verify(), () => authApi.verify()),
  notifications: () => buildQuery(QK.auth.notifications(), () => authApi.getNotifications()),
};
