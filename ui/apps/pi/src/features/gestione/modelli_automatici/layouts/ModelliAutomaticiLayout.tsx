import TabsLayout from '../../../utilità/configurazioni/configurazioni_pec_peo/TabsLayout';
import { GetuseDataModelliAutomaticiConfigProvider } from '../hooks/useDataModelliConfig';
import { ModelliAutomaticiConfig } from '../ModelliAutomaticiConfig';

export const ModelliAutomaticiLayout = () => (
  <GetuseDataModelliAutomaticiConfigProvider>
    <ModelliAutomaticiConfig />
  </GetuseDataModelliAutomaticiConfigProvider>
);
