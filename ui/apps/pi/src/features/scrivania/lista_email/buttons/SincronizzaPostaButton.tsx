import SyncIcon from '@mui/icons-material/Sync';
import { FCC } from '@cmrc/types/FCC';
import { Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { dictionary } from './dictionary';

export interface LayoutListaEmailButtonsProps {
  onSync: () => void;
  isDisabled?:boolean;
  isLoading?:boolean;
}
export const SyncronizzaPostaButton: FCC<LayoutListaEmailButtonsProps> = ({ onSync, isLoading, isDisabled }) => (
  <Tooltip title={dictionary.get('syncbutton')} placement="top">
    <LoadingButton disabled={isDisabled} size='small' variant="outlined" loading={isLoading} onClick={onSync}>
      <SyncIcon />
    </LoadingButton>
  </Tooltip>
);