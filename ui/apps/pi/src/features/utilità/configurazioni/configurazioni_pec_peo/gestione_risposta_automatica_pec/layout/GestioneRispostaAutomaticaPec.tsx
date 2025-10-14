import TabsLayout from '../../TabsLayout';
import { PecEscluseRispostaAutomaticaConfiguration } from '../pecEscluse-table/PecEscluseRispostaAutomaticaConfiguration';
import { GetPecEscluseRispostaAutomaticaListProvider } from '../hooks/useDataPecEscluseRispostaAutomatica';

export const GestioneRispostaAutomaticaPec = () => (
  <TabsLayout currentTab="gestione-risposta-automatica-pec">
    <GetPecEscluseRispostaAutomaticaListProvider>
      <PecEscluseRispostaAutomaticaConfiguration />
    </GetPecEscluseRispostaAutomaticaListProvider>
  </TabsLayout>
);
