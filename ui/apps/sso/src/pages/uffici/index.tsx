import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ListaUffici } from '../../features/lista_uffici/ListaUffici';

const OfficesPage: NextPage = () => (
  <>
    <Head>
      <title>Uffici</title>
    </Head>

    <DashboardLayout title="Lista Uffici">
      <PageContainer>
        <ListaUffici />
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

export default OfficesPage;
