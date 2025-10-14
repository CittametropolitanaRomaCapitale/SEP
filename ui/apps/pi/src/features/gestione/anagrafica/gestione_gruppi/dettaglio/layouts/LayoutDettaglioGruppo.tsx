import Head from "next/head";
import { useRouter } from "next/router";
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { dictionary } from "../dictionary";
import { GetAnagraficaListProvider } from "../../../gestione_anagrafica/hooks/useDataAnagraficaList";
import { ContattiGruppoTable } from "../components/ContattiGruppo/ContattiGruppoTable";
import { DettaglioGruppoHeader } from "../components/DettaglioGruppoHeader";
import { GetDataDettaglioGruppoProvider } from "../hooks/useDataDettaglioGruppo";
import { DashboardLayout } from "../../../../../../components/DashboardLayout";
import { ContattiGruppoTableHeader } from "../components/ContattiGruppo/ContattiGruppoTableHeader";

export const LayoutDettaglioGruppo = () => {
  const { query } = useRouter();
  const title = `Dettaglio Gruppo`

  return (
    <>
      <Head>
        <title>Dettaglio Gruppo</title>
      </Head>

      <DashboardLayout
        title={title}
        back={{ link: '/anagrafica/gruppi', label: dictionary.get('gruppi') }}
      >
        <PageContainer>
          {/* Provider per recuperare le info di un determinato gruppo */}
          <GetDataDettaglioGruppoProvider idGruppo={Number(query?.id)}>
            <DettaglioGruppoHeader />
            {/* Provider della lista anagrafica per recuperare i contatti associati al gruppo */}
            <GetAnagraficaListProvider idGruppo={Number(query?.id)}>
              <ContattiGruppoTableHeader />
              <ContattiGruppoTable />
            </GetAnagraficaListProvider>
          </GetDataDettaglioGruppoProvider>
        </PageContainer>
      </DashboardLayout>
    </>
  );
}