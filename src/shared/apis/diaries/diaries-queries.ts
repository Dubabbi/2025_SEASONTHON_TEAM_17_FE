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
          cursor: typeof pageParam === 'number' ? pageParam : null,
        }),
      {
        initialPageParam: null,
        getNextPageParam: (last) => {
          const info = (last as any)?.data?.pageInfo;
          return info && info.hasNext ? (info.nextCursor ?? undefined) : undefined;
        },
      },
    ),

  detail: (id: number) => buildQuery(QK.diaries.detail(id), () => diariesApi.detail(id)),

  today: () => buildQuery(QK.diaries.today(), () => diariesApi.today()),

  // /api/v1/diaries/month?year={y}&month={m}
  monthDates: (y: number, m: number) =>
    buildQuery(QK.diaries.month(y, m), () => diariesApi.monthDates({ year: y, month: m })),

  // /api/v1/diaries/date?year={y}&month={m}&day={d}
  byDate: (y: number, m: number, d: number) =>
    buildQuery(QK.diaries.date(y, m, d), () => diariesApi.byDate({ year: y, month: m, day: d })),
};
