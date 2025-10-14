import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { DashboardLayout } from '../../components/DashboardLayout';
import { HeaderUtente } from '../../features/dettaglio_utente/HeaderUtente';
import { UfficiUtente } from '../../features/dettaglio_utente/uffici_utente/UfficiUtente';
import { RuoliAmministrazione } from '../../features/dettaglio_utente/ruoli_amministrazione/RuoliAmministrazione';
import { PermessiUtente } from '../../features/dettaglio_utente/permessi_utente/PermessiUtente';
import { DelegheInviate } from '../../features/dettaglio_utente/deleghe_utente/DelegheInviate';
import { DelegheRicevute } from '../../features/dettaglio_utente/deleghe_utente/DelegheRicevute';

const UtentePage: NextPage = () => (
  <>
    <Head>
      <title>Utente</title>
    </Head>

    <DashboardLayout
      title="Dettaglio Utente"
      back={{ link: '/', label: 'Lista Utenti' }}
    >
      <PageContainer>
        <HeaderUtente />
        <UfficiUtente />
        <RuoliAmministrazione />
        <PermessiUtente />
        <DelegheInviate />
        <DelegheRicevute />
      </PageContainer>
    </DashboardLayout>
  </>
);

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

export default UtentePage;
