import TabsLayout from '../../TabsLayout';
import { TagConfiguration } from '../tag-table/TagConfiguration';
import { GetTagListProvider } from '../hooks/useDataTag';

export const GestioneTag = () => (
  <TabsLayout currentTab="gestione-tag">
    <GetTagListProvider>
      <TagConfiguration />
    </GetTagListProvider>
  </TabsLayout>
);
