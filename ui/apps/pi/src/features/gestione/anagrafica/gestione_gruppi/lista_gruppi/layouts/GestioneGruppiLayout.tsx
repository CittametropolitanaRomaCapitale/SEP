import TabsLayout from "../../../AnagraficaTabsLayout";
import { GruppiList } from "../components/GruppiList";
import { GetGruppiListProvider } from "../hooks/useDataGruppiList";

export const GestioneGruppiLayout = () => (
  <TabsLayout currentTab="gruppi">
    <GetGruppiListProvider>
      <GruppiList />
    </GetGruppiListProvider>
  </TabsLayout>
);