import { useRouter } from 'next/router';
import { UserOffice } from '@cmrc/services';
import { useOffice } from '@cmrc/auth/useOffice';

export const useDashboardLayout = () => {
  const router = useRouter();
  const { cdrCode } = useOffice();

  const redirectToActivityList = (office?: UserOffice) => {
    if (office?.office?.code !== cdrCode) {
      router.push('/');
    }
  };

  return {
    redirectToActivityList
  };
};
