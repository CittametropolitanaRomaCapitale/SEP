import { FCC } from '@cmrc/types/FCC';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface ColumnHeaderProps {
  label: string;
}

const ColumnHeader: FCC<ColumnHeaderProps> = ({ label }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Typography sx={{ fontWeight: 600, fontSize: '0.750rem' }}>
      {label}
    </Typography>
  </Box>
);

export default ColumnHeader;
