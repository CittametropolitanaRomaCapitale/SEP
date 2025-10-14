import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { VisibilitaTitolario } from '@cmrc/services/src/app/piapi/generated';
import { ModificaPermessoButton } from './ModificaPermessoButton';
import { EliminaPermessoButton } from './EliminaPermessoButton';

export const PermessiFascicoloButtons: FCC<{ permesso?: VisibilitaTitolario }> = ({
  permesso
}) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    {/* <ModificaPermessoButton permesso={permesso} /> */}
    <EliminaPermessoButton permesso={permesso} />
  </Grid>
);
