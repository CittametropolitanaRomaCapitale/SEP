import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { DashboardLayout } from '../components/DashboardLayout';
import { ListaUtenti } from '../features/lista_utenti/ListaUtenti';
import { RicercaAvanzataUtentiButtons } from '../features/lista_utenti/ricerca_avanzata/RicercaAvanzataUtentiButtons';

const UsersPage: NextPage = () => (
  <>
    <Head>
      <title>Utenti</title>
    </Head>

    <DashboardLayout title="Lista Utenti">
      <PageContainer>
        <RicercaAvanzataUtentiButtons />
        <ListaUtenti />
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

export default UsersPage;
