import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FCC } from '@cmrc/types/FCC';

export interface EntityCellProps {
  label?: string;
  value?: string | number;
}

const EntityCell: FCC<EntityCellProps> = ({ label, value }) => (
  <Stack>
    <Typography
      sx={(theme) => ({
        fontSize: '0.75rem',
        color: theme.palette.grey[600]
      })}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem' }}>
      {value != null ? value : '-'}
    </Typography>
  </Stack>
);

export default EntityCell;
