import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  useEffect(() => {router.replace('/protocolli')})
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const permissions = await getPermissionToken(session?.access_token, []);

  return {
    props: {
      session,
      permissions
    }
  };
}
export default HomePage;