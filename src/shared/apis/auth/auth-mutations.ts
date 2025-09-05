import { authApi } from '@apis/auth/auth';
import { buildMutation } from '@apis/factory';

export const authMutations = {
  kakaoCallback: () => buildMutation(authApi.kakaoCallback),
  saveFcmToken: () => buildMutation(authApi.saveFcmToken),
  disableFcmToken: () => buildMutation(authApi.disableFcmToken),
};
