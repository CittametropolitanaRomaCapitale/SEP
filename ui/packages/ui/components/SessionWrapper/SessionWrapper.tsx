import { FCC } from '@cmrc/types/FCC';
import { useSession } from 'next-auth/react';
import { useAuth } from '../../hooks/use-auth';
import { useEffect } from 'react';

export const SessionWrapper: FCC<any> = ({ children }) => {
  const { data } = useSession();
  const { logout } = useAuth();

  useEffect(() => {
    async function doLogout() {
      await logout();
    }
    if (data?.error && data?.error === 'AccessTokenError') {
      console.warn('SESSION EXPIRED');
      doLogout();
    }
  }, [data, logout]);

  return children;
};
