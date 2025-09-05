import { buildMutation } from '@apis/factory';
import { authApi } from './auth';

export const authMutations = {
  kakaoCallback: () => buildMutation(authApi.kakaoCallback),
};
