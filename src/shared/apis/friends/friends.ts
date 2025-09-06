import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/http';

const http = new HttpClient(axiosInstance);

type Friend = {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl: string;
};
type CursorList<T> = { data: T[]; nextCursor: number | null; hasNext: boolean };

export const friendsApi = {
  list: (params: { cursor?: number | null; limit?: number }) =>
    http.get<Rsp<CursorList<Friend>>>(ENDPOINTS.friends.root, { params }),
  sent: (params: { cursor?: number | null; limit?: number }) =>
    http.get<Rsp<CursorList<Friend>>>(ENDPOINTS.friends.sent, { params }),
  received: (params: { cursor?: number | null; limit?: number }) =>
    http.get<Rsp<CursorList<Friend>>>(ENDPOINTS.friends.received, { params }),

  request: (body: { email: string }) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.friends.request, body),
  accept: (body: { email: string }) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.friends.accept, body),
  reject: (body: { email: string }) =>
    http.post<Rsp<null>, typeof body>(ENDPOINTS.friends.reject, body),
  cancel: (toEmail: string) =>
    http.delete<Rsp<null>>(ENDPOINTS.friends.cancel, { params: { toEmail } }),
  remove: (email: string) => http.delete<Rsp<null>>(ENDPOINTS.friends.root, { params: { email } }),

  searchAll: (params: { keyword: string; cursor?: number | null; limit?: number }) =>
    http.get<Rsp<CursorList<Friend & { isFriend: boolean; isRequested: boolean }>>>(
      ENDPOINTS.friends.searchAll,
      { params },
    ),
  searchSent: (params: { keyword: string; cursor?: number | null; limit?: number }) =>
    http.get<Rsp<CursorList<Friend>>>(ENDPOINTS.friends.searchSent, { params }),
  searchReceived: (params: { keyword: string; cursor?: number | null; limit?: number }) =>
    http.get<Rsp<CursorList<Friend>>>(ENDPOINTS.friends.searchReceived, {
      params,
    }),
  searchMy: (params: { keyword: string; cursor?: number | null; limit?: number }) =>
    http.get<Rsp<CursorList<Friend>>>(ENDPOINTS.friends.searchMy, { params }),
};
