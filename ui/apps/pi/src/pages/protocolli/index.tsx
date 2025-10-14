import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { LayoutListaProtocolli } from '../../features/scrivania/lista_protocolli/layouts/LayoutListaProtocolli';

const ListaProtocolliPage: NextPage = () => <LayoutListaProtocolli/>;

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

export default ListaProtocolliPage;
