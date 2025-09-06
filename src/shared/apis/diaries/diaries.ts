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
  privacySetting: 'PUBLIC' | 'PRIVACY';
  feedback?: string;
  feedbackTitle?: string;
  feedbackContent?: string;
  emotions: { emotionId: number; type: string; likeCount: number }[] | string[];
}>;

export const diariesApi = {
  list: (params: { email: string; cursor?: number | null; limit?: number }) =>
    http.get<DiariesListRes>(ENDPOINTS.diaries.root, { params }),

  create: (body: { title: string; content: string; privacySetting: 'PUBLIC' | 'PRIVACY' }) =>
    http.post<Rsp<{ diaryId: number }>, typeof body>(ENDPOINTS.diaries.root, body),

  createWithDate: (body: {
    title: string;
    content: string;
    privacySetting: 'PUBLIC' | 'PRIVACY';
    createdAt: string;
  }) => http.post<Rsp<{ diaryId: number }>, typeof body>(ENDPOINTS.diaries.with, body),

  detail: (diaryId: number) => http.get<DiaryDetailRes>(ENDPOINTS.diaries.byId(diaryId)),

  remove: (diaryId: number) => http.delete<Rsp<null>>(ENDPOINTS.diaries.byId(diaryId)),

  togglePrivacy: (diaryId: number) =>
    http.patch<Rsp<{ diaryId: number; privacySetting: 'PUBLIC' | 'PRIVACY' }>>(
      ENDPOINTS.diaries.byId(diaryId),
      {},
    ),

  updatePrivacy: (diaryId: number, privacySetting: 'PUBLIC' | 'PRIVACY') =>
    http.patch<
      Rsp<{ diaryId: number; privacySetting: 'PUBLIC' | 'PRIVACY' }>,
      { privacySetting: 'PUBLIC' | 'PRIVACY' }
    >(ENDPOINTS.diaries.byId(diaryId), { privacySetting }),

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
    http.get<DiaryDetailRes>(ENDPOINTS.diaries.date, {
      params: {
        year: params.year,
        month: params.month,
        day: params.day,
      },
    }),
};

export const updateDiaryPrivacy = (diaryId: number, privacySetting: 'PUBLIC' | 'PRIVACY') =>
  diariesApi.updatePrivacy(diaryId, privacySetting);
