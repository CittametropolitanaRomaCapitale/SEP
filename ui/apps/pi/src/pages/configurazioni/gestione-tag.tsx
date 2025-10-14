import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { DashboardLayout } from '../../components/DashboardLayout';
import { DashboardLayoutTitle } from '../../components/DashboardLayoutTitle';
import { GestioneTag } from '../../features/utilità/configurazioni/configurazioni_pec_peo/gestione_tag/layout/GestioneTag';

const GestioneTagPage: NextPage = () => {
  const title = 'Configurazioni';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout title={<DashboardLayoutTitle sezione={title} />}>
        <PageContainer>
          <GestioneTag />
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

export default GestioneTagPage;
