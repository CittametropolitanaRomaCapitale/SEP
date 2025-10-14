import { FCC } from '@cmrc/types/FCC';
import type { DrawerProps } from '@mui/material';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Close from '@mui/icons-material/Close';

export const Drawer: FCC<DrawerProps> = ({
  title,
  children,
  anchor = 'right',
  open,
  onClose,
  ...props
}) => {
  return (
    <MuiDrawer anchor={anchor} onClose={onClose} open={open} {...props}>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 2
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton
          color="inherit"
          onClick={onClose as any}
          aria-label="close-drawer"
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
      {children}
    </MuiDrawer>
  );
};

export default Drawer;
