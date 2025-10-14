import { FCC } from '@cmrc/types/FCC';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import Grid from '@mui/material/Grid';
import { useOffice } from '@cmrc/auth/useOffice';
import { CreaProtocollo } from './buttons/CreaProtocollo';
import { RicercaAvanzataProtocolli } from './buttons/RicercaAvanzataProtocolli';
import { EsportaProtocolli } from './buttons/EsportaProtocolli';
import { LavorazioneMassiva } from './buttons/lavorazione_massiva/LavorazioneMassiva';

interface TopbarProtocolliListProps {
  selectedProtocolli: ProtocolloBaseFragment[];
}

export const TopbarProtocolliList: FCC<TopbarProtocolliListProps> = ({
  selectedProtocolli
}) => {
  const { isUserProtocollatore, isUserArchivista } = useOffice();

  return (
    <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'right' }}>
      <LavorazioneMassiva selectedProtocolli={selectedProtocolli} />
      <EsportaProtocolli selectedProtocolli={selectedProtocolli} />
      <RicercaAvanzataProtocolli />
      {(isUserProtocollatore || isUserArchivista) && <CreaProtocollo />}
    </Grid>
  );
};
