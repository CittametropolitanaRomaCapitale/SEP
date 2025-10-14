import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { AnagraficaDto } from '@cmrc/services/src/app/piapi/generated';
import { EliminaContattoButton } from './EliminaContattoButton';
import { ModificaContattoButton } from './ModificaContattoButton';

export const TableAnagraficaButtons: FCC<{ contatto?: AnagraficaDto }> = ({
  contatto
}) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    <ModificaContattoButton contatto={contatto} />
    <EliminaContattoButton contatto={contatto} />
  </Grid>
);
