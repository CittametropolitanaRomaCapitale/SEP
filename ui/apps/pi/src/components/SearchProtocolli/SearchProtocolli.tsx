import Grid from '@mui/material/Grid';
import { FCC } from '@cmrc/types/FCC';
import { Protocollo, RicercaProtocolliDtoInput } from '@cmrc/services/src/app/piapi/generated';
import { Button, Card } from '@mui/material';
import { GetSearchProtocolliListProvider } from '../../hooks/useDataSearchProtocolliList';
import { TableSearchProtocolli } from './TableSearchProtocolli';
import { dictionary } from '../../dictionary';

export const SearchProtocolli: FCC<{
  defaultValues?: RicercaProtocolliDtoInput;
  onSelectItem?: (protocollo?: Protocollo) => void;
  onSearchClose?: () => void;

}> = ({ defaultValues, onSelectItem, onSearchClose }) => (
  <>
    <Card sx={{ padding: 0 }}>
      <Grid sx={{ width: 1 }}>
        <GetSearchProtocolliListProvider initialData={defaultValues}>
          <TableSearchProtocolli
            defaultValues={defaultValues}
            onSelectItem={(protocollo?: Protocollo) => {
              onSelectItem?.(protocollo);
              onSearchClose?.();
            }}
          />
        </GetSearchProtocolliListProvider>
      </Grid>
    </Card>
    <Grid item container mt={3} justifyContent="flex-end">
      <Button
        size="small"
        variant="outlined"
        sx={{ height: '30px' }}
        onClick={onSearchClose}
      >
        {dictionary.get('cancel')}
      </Button>
    </Grid>
  </>

);
