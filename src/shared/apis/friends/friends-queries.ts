import { QK } from '@apis/constants/keys';
import { buildInfiniteQuery, buildQuery } from '@apis/factory';
import { friendsApi } from '@apis/friends/friends';

const cursorPager =
  <T extends { data: { nextCursor: number | null; hasNext: boolean } }>() =>
  (lastPage: T) =>
    lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;

export const friendsQueries = {
  listInfinite: (limit = 5) =>
    buildInfiniteQuery(
      QK.friends.list(limit),
      ({ pageParam }) =>
        friendsApi.list({
          limit,
          cursor: (pageParam as number | null) ?? null,
        }),
      { initialPageParam: null, getNextPageParam: cursorPager() },
    ),
  sentInfinite: (limit = 5) =>
    buildInfiniteQuery(
      QK.friends.sent(limit),
      ({ pageParam }) =>
        friendsApi.sent({
          limit,
          cursor: (pageParam as number | null) ?? null,
        }),
      { initialPageParam: null, getNextPageParam: cursorPager() },
    ),
  receivedInfinite: (limit = 5) =>
    buildInfiniteQuery(
      QK.friends.received(limit),
      ({ pageParam }) =>
        friendsApi.received({
          limit,
          cursor: (pageParam as number | null) ?? null,
        }),
      { initialPageParam: null, getNextPageParam: cursorPager() },
    ),
  searchAll: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchAll(keyword), () =>
      friendsApi.searchAll({ keyword, limit, cursor: null }),
    ),
  searchSent: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchSent(keyword), () =>
      friendsApi.searchSent({ keyword, limit, cursor: null }),
    ),
  searchReceived: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchReceived(keyword), () =>
      friendsApi.searchReceived({ keyword, limit, cursor: null }),
    ),
  searchMy: (keyword: string, limit = 5) =>
    buildQuery(QK.friends.searchMy(keyword), () =>
      friendsApi.searchMy({ keyword, limit, cursor: null }),
    ),
};
