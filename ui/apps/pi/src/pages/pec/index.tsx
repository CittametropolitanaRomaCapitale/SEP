import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { LayoutListaEmail } from '../../features/scrivania/lista_email/layouts/LayoutListaEmail';

const ListaEmailPage: NextPage = () => <LayoutListaEmail />;

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

export default ListaEmailPage;
