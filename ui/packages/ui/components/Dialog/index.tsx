import { FCC } from '@cmrc/types/FCC';
import type { DialogProps as MUIDialogProps } from '@mui/material';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Close from '@mui/icons-material/Close';

export type DialogProps = {
  hideCloseButton?: boolean;
} & MUIDialogProps;

export const Dialog: FCC<DialogProps> = ({
  title,
  children,
  open,
  fullWidth = true,
  hideCloseButton = false,
  onClose,
  ...props
}) => {
  return (
    <MuiDialog
      fullWidth={fullWidth}
      maxWidth="lg"
      onClose={onClose}
      open={open}
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
        {!hideCloseButton && (
          <IconButton color="inherit" onClick={onClose as any}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
      <DialogContent>{children}</DialogContent>
    </MuiDialog>
  );
};

export default Dialog;
