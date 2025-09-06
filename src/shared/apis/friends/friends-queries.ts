import { QK } from '@apis/constants/keys';
import { buildInfiniteQuery, buildQuery } from '@apis/factory';
import { friendsApi } from '@apis/friends/friends';

type PageOf<T> = T extends (...args: infer _A) => infer R ? Awaited<R> : never;

const cursorPager =
  <T extends { data: { nextCursor: number | null; hasNext: boolean } }>() =>
  (lastPage: T): number | null =>
    lastPage.data.hasNext ? lastPage.data.nextCursor : null;

export const friendsQueries = {
  listInfinite: (limit = 5) =>
    buildInfiniteQuery<
      PageOf<typeof friendsApi.list>,
      ReturnType<typeof QK.friends.list>,
      number | null
    >(
      QK.friends.list(limit),
      ({ pageParam }) => friendsApi.list({ limit, cursor: pageParam ?? null }),
      { initialPageParam: null, getNextPageParam: cursorPager() },
    ),

  sentInfinite: (limit = 5) =>
    buildInfiniteQuery<
      PageOf<typeof friendsApi.sent>,
      ReturnType<typeof QK.friends.sent>,
      number | null
    >(
      QK.friends.sent(limit),
      ({ pageParam }) => friendsApi.sent({ limit, cursor: pageParam ?? null }),
      { initialPageParam: null, getNextPageParam: cursorPager() },
    ),

  receivedInfinite: (limit = 5) =>
    buildInfiniteQuery<
      PageOf<typeof friendsApi.received>,
      ReturnType<typeof QK.friends.received>,
      number | null
    >(
      QK.friends.received(limit),
      ({ pageParam }) => friendsApi.received({ limit, cursor: pageParam ?? null }),
      { initialPageParam: null, getNextPageParam: cursorPager() },
    ),

  searchAllInfinite: (keyword: string, limit = 5) =>
    buildInfiniteQuery<
      PageOf<typeof friendsApi.searchAll>,
      ReturnType<typeof QK.friends.searchAll>,
      number | null
    >(
      QK.friends.searchAll(keyword),
      ({ pageParam }) =>
        friendsApi.searchAll(
          pageParam == null ? { keyword, limit } : { keyword, limit, cursor: pageParam },
        ),
      { initialPageParam: null, getNextPageParam: cursorPager() },
    ),

  searchAll: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchAll(keyword), () => friendsApi.searchAll({ keyword, limit })),
  searchSent: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchSent(keyword), () => friendsApi.searchSent({ keyword, limit })),
  searchReceived: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchReceived(keyword), () =>
      friendsApi.searchReceived({ keyword, limit }),
    ),
  searchMy: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchMy(keyword), () => friendsApi.searchMy({ keyword, limit })),
};
