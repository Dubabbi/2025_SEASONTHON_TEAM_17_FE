import { QK } from '@apis/constants/keys';
import { diariesApi } from '@apis/diaries/diaries';
import { buildInfiniteQuery, buildQuery } from '@apis/factory';

export const diariesQueries = {
  listInfinite: (args: { email: string; limit?: number }) =>
    buildInfiniteQuery(
      QK.diaries.list(args.email, args.limit),
      ({ pageParam }) =>
        diariesApi.list({
          email: args.email,
          limit: args.limit ?? 3,
          cursor: (pageParam as number | null | undefined) ?? null,
        }),
      {
        initialPageParam: null,
        getNextPageParam: (last) =>
          last.data.pageInfo.hasNext ? last.data.pageInfo.nextCursor : undefined,
      },
    ),

  detail: (id: number) => buildQuery(QK.diaries.detail(id), () => diariesApi.detail(id)),

  today: () => buildQuery(QK.diaries.today(), () => diariesApi.today()),

  // GET /api/v1/diaries/month?year={y}&month={m}
  monthDates: (y: number, m: number) =>
    buildQuery(
      QK.diaries.month(y, m),
      () => diariesApi.monthDates({ year: y, month: m }),
      { staleTime: 5 * 60_000 }, // 월 단위 데이터라 조금 길게 캐시
    ),

  // GET /api/v1/diaries/date?date=YYYY-MM-DD
  byDate: (y: number, m: number, d: number) =>
    buildQuery(QK.diaries.date(y, m, d), () => diariesApi.byDate({ year: y, month: m, day: d }), {
      staleTime: 30_000,
    }),
};
