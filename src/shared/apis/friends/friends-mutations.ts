import { buildMutation } from '@apis/factory';
import { friendsApi } from '@apis/friends/friends';

export const friendsMutations = {
  request: () => buildMutation(friendsApi.request),
  accept: () => buildMutation(friendsApi.accept),
  reject: () => buildMutation(friendsApi.reject),
  cancel: () => buildMutation((toEmail: string) => friendsApi.cancel(toEmail)),
  remove: () => buildMutation((email: string) => friendsApi.remove(email)),
};
