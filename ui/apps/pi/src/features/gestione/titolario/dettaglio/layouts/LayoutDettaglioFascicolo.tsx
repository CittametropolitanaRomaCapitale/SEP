import Head from "next/head";
import { useRouter } from "next/router";
import { PageContainer } from '@cmrc/ui/components/PageContainer';
import { GetDataDettaglioFascicoloProvider } from "../hooks/useDataDettaglioFascicolo";
import { PermessiFascicolo } from "../components/Permessi/PermessiFascicolo";
import { DashboardLayout } from "../../../../../components/DashboardLayout";
import { dictionary } from "../dictionary";
import { PermessiFascicoloTableHeader } from "../components/Permessi/PermessiFascicoloTableHeader";
import { DettaglioFascicoloHeader } from "../components/DettaglioFascicoloHeader";
import { GetDataPermessiFascicoloProvider } from "../hooks/useDataPermessiFascicolo";

export const LayoutDettaglioFascicolo = () => {
  const { query } = useRouter();
  const title = `Dettaglio Fascicolo`

  return (
    <>
      <Head>
        <title>Dettaglio Fascicolo</title>
      </Head>

      <DashboardLayout
        title={title}
        back={{ link: '/titolario', label: dictionary.get('titolario') }}
      >
        <PageContainer>
          <GetDataDettaglioFascicoloProvider idTitolario={Number(query?.id)}>
            <DettaglioFascicoloHeader />
            <GetDataPermessiFascicoloProvider idTitolario={Number(query?.id)}>
              <PermessiFascicoloTableHeader />
              <PermessiFascicolo />
            </GetDataPermessiFascicoloProvider>
          </GetDataDettaglioFascicoloProvider>
        </PageContainer>
      </DashboardLayout>
    </>
  );
}