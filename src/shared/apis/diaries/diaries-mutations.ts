import { diariesApi } from '@apis/diaries/diaries';
import { buildMutation } from '@apis/factory';

export const diariesMutations = {
  create: () => buildMutation(diariesApi.create),
  remove: () => buildMutation((diaryId: number) => diariesApi.remove(diaryId)),
  togglePrivacy: () => buildMutation((diaryId: number) => diariesApi.togglePrivacy(diaryId)),
};
