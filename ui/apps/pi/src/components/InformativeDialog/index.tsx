import { FCC } from '@cmrc/types/FCC';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDialog } from '../../store/dialog/useDialog';

export interface InformativeDialogProps {
  message?: string | JSX.Element;
  cancelString?: string;
  sx?: SxProps;
  onCancel?: () => void;
}

const InformativeDialog: FCC<InformativeDialogProps> = ({
  message,
  cancelString,
  sx,
  onCancel
}) => {
  const { close } = useDialog({ dialog_id: 'informativeDialog' });

  return (
    <Grid container rowSpacing={2} sx={sx}>
      <Grid item container mt={3}>
        <Typography>{message}</Typography>
      </Grid>
      <Grid item container mt={3} justifyContent="flex-end">
        <Button
          onClick={() => {
            close();
            if (onCancel) onCancel();
          }}
          size="small"
          variant="outlined"
          sx={{ height: '30px', mr: 1 }}
        >
          {cancelString}
        </Button>
      </Grid>
    </Grid>
  );
};

export default InformativeDialog;
