import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';
import Box from '@mui/material/Box';
import { FC } from 'react';

export const EmptyCronologia: FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    sx={{ padding: 3 }}
  >
    <InboxIcon color="disabled" sx={{ width: '60px', height: '60px' }} />
    <Typography
      color="text.disabled"
      fontWeight="500"
      gutterBottom
      marginTop={2}
    >
      La cronologia è vuota
    </Typography>
  </Box>
);
