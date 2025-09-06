import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/http';

const http = new HttpClient(axiosInstance);

export type PatchNicknameBody = { nickname: string };

export const membersApi = {
  mypage: () =>
    http.get<
      | { data?: { nickname?: string; profilePath?: string } }
      | { nickname?: string; profilePath?: string }
    >(ENDPOINTS.members.mypage),

  updateNickname: (nickname: string) =>
    http.patch<Rsp<{ nickname: string }>, PatchNicknameBody>(ENDPOINTS.members.mypage, {
      nickname,
    }),
};
