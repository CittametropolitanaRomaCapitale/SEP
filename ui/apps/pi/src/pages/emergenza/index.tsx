import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { DashboardLayout } from '../../components/DashboardLayout';
import { DashboardLayoutTitle } from '../../components/DashboardLayoutTitle';
import { EmergenzaLayout } from '../../features/gestione/emergenza/EmergenzaLayout';

const ImportProtocolliEmergenzaPage: NextPage = () => {
  const title = 'Gestione Protocolli di emergenza';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout title={<DashboardLayoutTitle sezione={title} />}>
        <PageContainer>
          <EmergenzaLayout />
        </PageContainer>
      </DashboardLayout>
    </>
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

export default ImportProtocolliEmergenzaPage;
