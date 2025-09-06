import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';

const http = new HttpClient(axiosInstance);

export type MyPage = {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
  provider?: 'kakao' | string;
};

export const membersApi = {
  mypage: () => http.get<MyPage>(ENDPOINTS.members.mypage),
};
