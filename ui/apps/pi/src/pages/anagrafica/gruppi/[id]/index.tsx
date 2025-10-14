import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { LayoutDettaglioGruppo } from '../../../../features/gestione/anagrafica/gestione_gruppi/dettaglio/layouts/LayoutDettaglioGruppo';

const DettaglioGruppoPage: NextPage = () => <LayoutDettaglioGruppo />;

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

export default DettaglioGruppoPage;
