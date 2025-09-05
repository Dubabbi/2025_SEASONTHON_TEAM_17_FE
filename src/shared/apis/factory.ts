import type { QueryKey } from '@tanstack/react-query';

export const buildQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
    select?: (data: T) => unknown;
  },
) => ({
  queryKey,
  queryFn,
  ...options,
});

export const buildInfiniteQuery = <TPage>(
  queryKey: QueryKey,
  queryFn: (ctx: { pageParam?: unknown }) => Promise<TPage>,
  options: {
    getNextPageParam: (lastPage: TPage, all: TPage[]) => unknown;
    initialPageParam?: unknown;
    enabled?: boolean;
    staleTime?: number;
    select?: (data: { pages: TPage[]; pageParams: unknown[] }) => unknown;
  },
) => ({
  queryKey,
  queryFn,
  ...options,
});

export const buildMutation = <TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
    onError?: (err: unknown, variables: TVariables, context: unknown) => void;
  },
) => ({
  mutationFn,
  ...options,
});
