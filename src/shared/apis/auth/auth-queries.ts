import type { AuthStatusResponse, MeResponse } from '@apis/auth/auth';
import { AUTH_KEY } from '@apis/constants/keys';
import { api } from '@apis/factory';
import { useQuery } from '@tanstack/react-query';

export const useMeQuery = () =>
  useQuery<MeResponse>({
    queryKey: AUTH_KEY.ME(),
    queryFn: () => api.auth.me(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const useAuthStatusQuery = () =>
  useQuery<AuthStatusResponse>({
    queryKey: AUTH_KEY.STATUS(),
    queryFn: () => api.auth.getStatus(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
