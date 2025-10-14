import TabsLayout from "../../TabsLayout";
import { GetuseDataConservazioneConfigProvider } from "../hooks/useDataConservazioneConfig";
import { ConservazioneConfig } from "../ConservazioneConfig";

export const ConservazioneLayout = () => (
  <TabsLayout currentTab="conservazione-sostitutiva">
    <GetuseDataConservazioneConfigProvider>
      <ConservazioneConfig />
    </GetuseDataConservazioneConfigProvider>
  </TabsLayout>
);