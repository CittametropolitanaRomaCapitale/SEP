import { FCC } from '@cmrc/types/FCC';
import type { PopoverProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MuiPopover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

export const Popover: FCC<PopoverProps> = ({
  title,
  children,
  open,
  anchorEl,
  onClose,
  ...props
}) => {
  return (
    <MuiPopover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      {...props}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E6E8F0',
          px: 2,
          py: 1
        }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        <IconButton color="inherit" onClick={onClose as any}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      {children}
    </MuiPopover>
  );
};

export default Popover;
