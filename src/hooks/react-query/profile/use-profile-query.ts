import { QUERY_KEYS } from '@/constant/query-key';
import { Profile } from '@/libs/api/profile/profile';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/utills/toast';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => Profile.Get(),
    enabled: !!useAuthStore.getState().token,
  });
};


interface ProfileUpdateResponse {
  status: string;
  data?: unknown;
}

interface ProfileUpdateError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface useUpdateProfileOptions {
  onSuccess?: (data: ProfileUpdateResponse) => void;
  onError?: (error: ProfileUpdateError) => void;
}

export const useUpdateProfile = (options?: useUpdateProfileOptions) => {
  return useMutation<ProfileUpdateResponse, ProfileUpdateError, FormData>({
    mutationFn: (formData: FormData) => Profile.Post(formData),
    onSuccess: (data) => {
      toast.success('프로필 설정이 완료되었습니다!');
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || '프로필 설정에 실패했습니다.');
      options?.onError?.(error);
    },
  });
};