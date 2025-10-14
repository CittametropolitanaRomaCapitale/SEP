import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { DashboardLayout } from '../../components/DashboardLayout';
import { DashboardLayoutTitle } from '../../components/DashboardLayoutTitle';
import { GestioneGruppiLayout } from '../../features/gestione/anagrafica/gestione_gruppi/lista_gruppi/layouts/GestioneGruppiLayout';

const GruppiPage: NextPage = () => {
  const title = 'Gruppi';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout
        title={<DashboardLayoutTitle sezione={title} />}
      >
        <PageContainer>
          <GestioneGruppiLayout />
        </PageContainer>
      </DashboardLayout>
    </>
  );
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

export default GruppiPage;
