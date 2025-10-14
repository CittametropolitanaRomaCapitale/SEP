import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { Protocollo } from '../../features/protocollo/Protocollo';
import { GetDataDettaglioProtocolloProvider } from '../../features/protocollo/useDataDettaglioProtocollo';
import { DashboardLayout } from '../../components/DashboardLayout';
import { DashboardLayoutTitle } from '../../components/DashboardLayoutTitle';

const ProtocolloPage: NextPage = () => {
  const title = 'Crea protocollo / circolare';

  const router = useRouter();
  const { from } = router.query;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout title={<DashboardLayoutTitle sezione={title} />}>
        <PageContainer>
          <GetDataDettaglioProtocolloProvider nProtocollo={from && typeof from === 'string' ? from : null}>
            <Protocollo readMode={false}/>
          </GetDataDettaglioProtocolloProvider>
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
export default ProtocolloPage;
