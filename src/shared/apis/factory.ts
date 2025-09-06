import type {
  InfiniteData,
  QueryFunctionContext,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

export const buildQuery = <TData, TKey extends QueryKey = QueryKey>(
  queryKey: TKey,
  queryFn: (context: QueryFunctionContext<TKey>) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, unknown, TData, TKey>, 'queryKey' | 'queryFn'>,
): UseQueryOptions<TData, unknown, TData, TKey> => ({
  queryKey,
  queryFn,
  ...(options ?? {}),
});

export const buildInfiniteQuery = <TPage, TKey extends QueryKey = QueryKey, TPageParam = unknown>(
  queryKey: TKey,
  queryFn: (context: QueryFunctionContext<TKey, TPageParam>) => Promise<TPage>,
  options: Omit<
    UseInfiniteQueryOptions<TPage, unknown, InfiniteData<TPage>, TKey, TPageParam>,
    'queryKey' | 'queryFn'
  >,
): UseInfiniteQueryOptions<TPage, unknown, InfiniteData<TPage>, TKey, TPageParam> => ({
  queryKey,
  queryFn,
  ...options,
});

export const buildMutation = <TData, TVariables = void, TContext = unknown, TError = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>,
) => ({ mutationFn, ...(options ?? {}) });
