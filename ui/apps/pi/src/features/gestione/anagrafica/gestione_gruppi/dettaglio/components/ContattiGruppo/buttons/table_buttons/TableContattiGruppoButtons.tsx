import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { Anagrafica } from '@cmrc/services/src/app/piapi/generated';
import { EliminaContattoFromGruppoButton } from './EliminaContattoFromGruppoButton';

export const TableContattiGruppoButtons: FCC<{ contatto?: Anagrafica }> = ({
  contatto,
}) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    <EliminaContattoFromGruppoButton contatto={contatto} />
  </Grid>
);
