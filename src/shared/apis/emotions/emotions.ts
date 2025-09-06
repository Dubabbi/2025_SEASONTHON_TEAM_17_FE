import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/http';

const http = new HttpClient(axiosInstance);

export const emotionsApi = {
  toggleLike: (emotionId: number) =>
    http.post<Rsp<'liked' | 'unliked'>>(ENDPOINTS.emotions.like(emotionId)),
};
