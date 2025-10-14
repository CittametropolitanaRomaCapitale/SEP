import TabsLayout from "../../TabsLayout";
import { GetuseDataConfigRaccomandataProvider } from "../hooks/useDataConfigRaccomandata";
import { RaccomandataWebConfig } from "../raccomandataWebConfig";

export const RaccomandataWebLayout = () => (
  <TabsLayout currentTab="gestione-raccomandata-online">
    <GetuseDataConfigRaccomandataProvider>
      <RaccomandataWebConfig />
    </GetuseDataConfigRaccomandataProvider>
  </TabsLayout>
);