import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { DashboardLayout } from '../../components/DashboardLayout';
import { DettaglioProtocolloWrapper } from '../../features/protocollo/layouts/DettaglioProtocolloWrapper';
import { GetDataDettaglioProtocolloProvider } from '../../features/protocollo/useDataDettaglioProtocollo';

const ProtocolloPage: NextPage = () => {
  const { query } = useRouter();
  return (
    <>
      <Head>
        <title>Dettaglio protocollo</title>
      </Head>

      <DashboardLayout
        back={{ link: '/protocolli', label: 'Protocolli / Circolari' }}
        title="Dettaglio"
      >
        <PageContainer>
          <GetDataDettaglioProtocolloProvider
            nProtocollo={String(query.nProtocollo)}
          >
            <DettaglioProtocolloWrapper />
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
