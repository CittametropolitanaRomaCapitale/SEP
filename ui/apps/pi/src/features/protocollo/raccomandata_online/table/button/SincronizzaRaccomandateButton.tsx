import SyncIcon from '@mui/icons-material/Sync';
import { FCC } from '@cmrc/types/FCC';
import { Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { dictionary } from '../../dictionary';

export interface SincronizzaRaccomandateButtonProps {
  onSync: () => void;
  loading?: boolean;
  disabled?: boolean;
}
export const SincronizzaRaccomandateButton: FCC<SincronizzaRaccomandateButtonProps> = ({ loading, onSync, disabled }) => (
  <Tooltip title={dictionary.get('syncButton')} placement="top">
    <LoadingButton
      disabled={disabled}
      size='small'
      variant="outlined"
      loading={loading}
      onClick={onSync}>
      <SyncIcon />
    </LoadingButton>
  </Tooltip>
)