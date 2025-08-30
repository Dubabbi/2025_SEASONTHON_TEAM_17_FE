import type { LogoutResponse, UpdateProfileRequest, UpdateProfileResponse } from '@apis/auth/auth';
import { AUTH_KEY } from '@apis/constants/keys';
import { api } from '@apis/factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearAccessToken } from '@utils/token';

export const useLogoutMutation = () => {
  const qc = useQueryClient();
  return useMutation<LogoutResponse, Error, void>({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      clearAccessToken();
      qc.invalidateQueries({ queryKey: AUTH_KEY.ME() });
    },
  });
};

export const useUpdateProfileMutation = () => {
  const qc = useQueryClient();
  return useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: (payload) => api.auth.updateProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_KEY.ME() });
    },
  });
};
