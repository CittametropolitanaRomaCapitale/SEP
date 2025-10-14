import Head from 'next/head';
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { GetDataEmailListProvider } from '../hooks/useDataEmailList';
import { ListaEmail } from '../ListaEmail';
import { DashboardLayout } from '../../../../components/DashboardLayout';
import { DashboardLayoutTitle } from '../../../../components/DashboardLayoutTitle';

export const LayoutListaEmail = () => {
  const title = 'PEC'

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout
        title={<DashboardLayoutTitle sezione={title} />}
      >
        <PageContainer>
          <GetDataEmailListProvider>
            {/* TODO:Implementare una topbar che consenta di selezionare la casella di posta da sicnronizzare */}
            <ListaEmail />
          </GetDataEmailListProvider>
        </PageContainer>
      </DashboardLayout>
    </>
  );
}
