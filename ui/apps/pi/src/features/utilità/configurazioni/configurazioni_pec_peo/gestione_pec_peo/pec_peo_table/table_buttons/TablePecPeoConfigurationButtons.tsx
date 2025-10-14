import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { PecPeo } from '@cmrc/services/src/app/piapi/generated';
import { DeletePecPeoButton } from './DeletePecPeoButton';
import { UpdatePecPeoButton } from './UpdatePecPeoButton';
import { GestioneMonitoraggioPec } from './GestioneMonitoraggioPec';

export const TablePecPeoConfigurationButtons: FCC<{
  configurazione?: PecPeo;
}> = ({ configurazione }) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    {configurazione?.configurazione?.tipologiaPosta === 'PEC' && (
      <GestioneMonitoraggioPec configurazione={configurazione} />
    )}
    <UpdatePecPeoButton configurazione={configurazione} />
    <DeletePecPeoButton configurazione={configurazione} />
  </Grid>
);
