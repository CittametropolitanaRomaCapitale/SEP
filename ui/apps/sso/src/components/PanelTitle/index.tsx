import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const PanelTitle: FC<{ name: string; type: string }> = ({
  name,
  type
}) => (
  <Card
    sx={{
      display: 'flex',
      alignItems: 'center',
      paddingInline: 2,
      paddingBlock: 1,
      borderEndStartRadius: 0,
      borderEndEndRadius: 0
    }}
  >
    <Typography variant="body2" sx={{ marginRight: '10px' }}>
      {name}
    </Typography>
    <ArrowForwardIosIcon sx={{ width: '12px' }} />
    <Typography variant="subtitle2" sx={{ marginLeft: '10px' }}>
      {type}
    </Typography>
  </Card>
);
