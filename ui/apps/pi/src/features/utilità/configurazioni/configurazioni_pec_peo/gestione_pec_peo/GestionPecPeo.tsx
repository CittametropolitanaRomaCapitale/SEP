import TabsLayout from '../TabsLayout'
import { PecPeoConfiguration } from './pec_peo_table/PecPeoConfiguration';
import { GetPecPeoListProvider } from './useDataPecPeo';

export const GestionPecPeo = () => (
  <TabsLayout currentTab="gestione-pec-peo">
    <GetPecPeoListProvider>
      <PecPeoConfiguration />
    </GetPecPeoListProvider>
  </TabsLayout>
);
