import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { DeletePecEsclusaButton } from './DeletePecEsclusaButton';
import { UpdatePecEsclusaButton } from './UpdatePecEsclusaButton';
import { PecEscluseRispostaAutomatica } from '@cmrc/services/src/app/piapi/generated';

type TablePecEscluseConfigurationButtonsProps = {
  pecEsclusaSelected: PecEscluseRispostaAutomatica;
};

export const TablePecEscluseConfigurationButtons: FCC<
  TablePecEscluseConfigurationButtonsProps
> = ({ pecEsclusaSelected }) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    <UpdatePecEsclusaButton pecEsclusaSelected={pecEsclusaSelected} />
    <DeletePecEsclusaButton pecEsclusaSelected={pecEsclusaSelected} />
  </Grid>
);
