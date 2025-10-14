import { useGetApiUserByIdQuery, User } from '@cmrc/services/sso';
import { useRouter } from 'next/router';

export const useGetUtente = () => {
  const { query } = useRouter();

  const { data, isLoading, refetch } = useGetApiUserByIdQuery({
    id: Number(query?.id)
  });

  return {
    data: data as User,
    isLoading,
    refetch
  };
};
