import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { Can, usePermission } from '@4dd/authz';
import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';

const Index: NextPage = () => {
  const can1 = usePermission(['Default Resource']);

  return (
    <div>
      <div>{can1 ? 'ciao' : ' non ciao'}</div>

      <Can permissionIds={['Default Resource']}>ciao</Can>
    </div>
  );
};

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

export default Index;
