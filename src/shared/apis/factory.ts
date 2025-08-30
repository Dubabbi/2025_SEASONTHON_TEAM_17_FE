import { createAuthApi } from '@apis/auth/auth';
import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';

const http = new HttpClient(axiosInstance);

export const api = {
  auth: createAuthApi(http),
} as const;

export type Api = typeof api;
