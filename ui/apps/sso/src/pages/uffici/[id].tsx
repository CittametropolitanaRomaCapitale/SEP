import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { DashboardLayout } from '../../components/DashboardLayout';
import { DettaglioUfficio } from '../../features/dettaglio_ufficio/DettaglioUfficio';

const UfficioPage: NextPage = () => (
  <>
    <Head>
      <title>Ufficio</title>
    </Head>

    <DashboardLayout
      title="Dettaglio Ufficio"
      back={{ link: '/uffici', label: 'Lista Uffici' }}
    >
      <PageContainer>
        <DettaglioUfficio />
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

export default UfficioPage;
