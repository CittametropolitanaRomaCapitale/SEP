import TabsLayout from '../../TabsLayout';
import { GestioneLivelloFascicolazioneConfig } from '../GestioneLivelloFascicolazioneConfig';
import { GetMaxLivelloFasciolazioneProvider } from '../hooks/useGetMaxLivelloFascicolazione';

export const GestioneLivelloFascicolazione = () => (
  <TabsLayout currentTab="gestione-livello-fascicolazione">
    <GetMaxLivelloFasciolazioneProvider>
      <GestioneLivelloFascicolazioneConfig />
    </GetMaxLivelloFasciolazioneProvider>
  </TabsLayout>
);
