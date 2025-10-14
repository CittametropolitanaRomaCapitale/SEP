import { ReactNode, useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import type { DialogProps as MUIDialogProps } from '@mui/material';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import Typography from '@mui/material/Typography';
import Close from '@mui/icons-material/Close';

export type FullScreenDialogProps = {
  hideCloseButton?: boolean;
  hideFullScreenButton?: boolean;
  contrastBackground?: boolean;
  customComponent?: ReactNode;
} & MUIDialogProps;

export const FullScreenDialog: FCC<FullScreenDialogProps> = ({
  title,
  children,
  open,
  fullWidth = true,
  hideCloseButton = false,
  hideFullScreenButton = false,
  contrastBackground = false,
  fullScreen,
  customComponent,
  onClose,
  ...props
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleToggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  return (
    <MuiDialog
      fullWidth={fullWidth}
      maxWidth="lg"
      onClose={onClose}
      open={open}
      fullScreen={isFullScreen}
      {...props}
    >
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {customComponent && customComponent}
          {!hideFullScreenButton && (
            <IconButton color="inherit" onClick={handleToggleFullScreen}>
              <OpenInFullIcon fontSize="small" />
            </IconButton>
          )}
          {!hideCloseButton && (
            <IconButton color="inherit" onClick={onClose as any}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      <DialogContent
        sx={contrastBackground ? { bgcolor: '#f9fafc' } : undefined}
      >
        {children}
      </DialogContent>
    </MuiDialog>
  );
};

export default FullScreenDialog;
