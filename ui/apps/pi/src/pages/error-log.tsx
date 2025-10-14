import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { DashboardLayout } from '../components/DashboardLayout';
// import { ListaErroriLog } from '../features/lista_errori_log/ListaErroriLog';

const ErrorLogPage: NextPage = () => (
  <>
    <Head>
      <title>Lista Log Errori</title>
    </Head>

    <DashboardLayout title="Lista Log Errori">
      <PageContainer>
        {/* <ListaErroriLog /> */}
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

export default ErrorLogPage;
