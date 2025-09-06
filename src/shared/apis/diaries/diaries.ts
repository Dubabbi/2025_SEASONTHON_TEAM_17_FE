import { HttpClient } from '@apis/base/http';
import { axiosInstance } from '@apis/base/instance';
import { ENDPOINTS } from '@apis/constants/endpoints';
import type { Rsp } from '@apis/constants/http';

const http = new HttpClient(axiosInstance);

type DiarySummary = {
  diaryId: number;
  title: string;
  content: string;
  feedback: string;
  createdAt: string;
};

type PageInfo = { nextCursor: number | null; hasNext: boolean };

export type DiariesListRes = Rsp<{
  diaries: DiarySummary[];
  pageInfo: PageInfo;
}>;
export type DiaryDetailRes = Rsp<{
  diaryId: number;
  title: string;
  content: string;
  privacySetting: 'PUBLIC' | 'PRIVATE';
  feedback: string;
  emotions: { emotionId: number; type: string; likeCount: number }[];
}>;

export const diariesApi = {
  list: (params: { email: string; cursor?: number | null; limit?: number }) =>
    http.get<DiariesListRes>(ENDPOINTS.diaries.root, { params }),
  create: (body: { title: string; content: string; privacySetting: 'PUBLIC' | 'PRIVATE' }) =>
    http.post<Rsp<{ diaryId: number }>, typeof body>(ENDPOINTS.diaries.root, body),
  detail: (diaryId: number) => http.get<DiaryDetailRes>(ENDPOINTS.diaries.byId(diaryId)),
  remove: (diaryId: number) => http.delete<Rsp<null>>(ENDPOINTS.diaries.byId(diaryId)),
  togglePrivacy: (diaryId: number) =>
    http.patch<Rsp<{ diaryId: number; privacySetting: 'PUBLIC' | 'PRIVATE' }>>(
      ENDPOINTS.diaries.byId(diaryId),
      {},
    ),
  today: () =>
    http.get<
      Rsp<
        | {
            written: true;
            diaryId: number;
            title: string;
            preview: string;
          }
        | { written: false }
      >
    >(ENDPOINTS.diaries.today),
  monthDates: (params: { year: number; month: number }) =>
    http.get<Rsp<number[]>>(ENDPOINTS.diaries.month, { params }),
  byDate: (params: { year: number; month: number; day: number }) =>
    http.get<DiaryDetailRes>(ENDPOINTS.diaries.date, { params }),
};
