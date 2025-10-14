import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { LayoutDettaglioFascicolo } from '../../../features/gestione/titolario/dettaglio/layouts/LayoutDettaglioFascicolo';

const DettaglioFascicoloPage: NextPage = () => <LayoutDettaglioFascicolo />;

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

export default DettaglioFascicoloPage;
