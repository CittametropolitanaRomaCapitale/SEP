import TabsLayout from "../../AnagraficaTabsLayout";
import { AnagraficaList } from "../components/AnagraficaList";
import { GetAnagraficaListProvider } from "../hooks/useDataAnagraficaList";

export const GestioneAnagraficaLayout = () => (
  <TabsLayout currentTab="anagrafica">
    <GetAnagraficaListProvider>
      <AnagraficaList />
    </GetAnagraficaListProvider>
  </TabsLayout>
);