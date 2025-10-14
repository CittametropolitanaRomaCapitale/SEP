import Head from 'next/head';
import { useState } from 'react';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { GetDataProtocolliListProvider } from '../hooks/useDataProtocolliList';
import { TopbarProtocolliList } from '../TopbarProtocolliList';
import { ListaProtocolli } from '../ListaProtocolli';
import { GetDataDettaglioProtocolloProvider } from '../../../protocollo/useDataDettaglioProtocollo';
import { DashboardLayout } from '../../../../components/DashboardLayout';
import { DashboardLayoutTitle } from '../../../../components/DashboardLayoutTitle';
export const LayoutListaProtocolli = () => {
  const title = 'Protocolli / Circolari';
  const [selectedProtocollo, setSelectedProtocollo] = useState();
  const [selectedProtocolli, setSelectedProtocolli] = useState<
    ProtocolloBaseFragment[]
  >([]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout title={<DashboardLayoutTitle sezione={title} />}>
        <PageContainer>
          <GetDataDettaglioProtocolloProvider nProtocollo={selectedProtocollo}>
              <GetDataProtocolliListProvider>
                <TopbarProtocolliList selectedProtocolli={selectedProtocolli} />
              <ListaProtocolli
                setSelectedProtocollo={setSelectedProtocollo}
                setSelectedProtocolli={setSelectedProtocolli}
              />
              </GetDataProtocolliListProvider>
          </GetDataDettaglioProtocolloProvider>
        </PageContainer>
      </DashboardLayout>
    </>
  );
};
