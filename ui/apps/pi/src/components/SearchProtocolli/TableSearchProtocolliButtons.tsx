import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { Protocollo } from '@cmrc/services/src/app/piapi/generated';

export const TableSearchProtocolliButtons: FCC<{
  protocollo?: Protocollo;
  onSelect?: (protocollo?: Protocollo) => void;
}> = ({ protocollo, onSelect }) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    <IconButton size="small" onClick={() => onSelect?.(protocollo)}>
      <AddIcon/>
    </IconButton>
  </Grid>
);
