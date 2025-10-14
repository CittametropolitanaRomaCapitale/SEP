import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { dictionary } from './dictionary';
import { GestioneLivelloFascicolazioneConfigForm } from './GestioneLivelloFascicolazioneConfigForm';

export const GestioneLivelloFascicolazioneConfig = () => {
  return (
    <>
      <TableExternalHeader
        title={dictionary.get('configurazioniLivelloFascicolazione')}
      />
      <GestioneLivelloFascicolazioneConfigForm />
    </>
  );
};
