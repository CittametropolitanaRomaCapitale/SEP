import { useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDialog } from '../../../store/dialog/useDialog';
import Textarea from '@cmrc/ui/form/FormComponents/Textarea';

export interface NoteDialogProps {
  note?: string;
  cancelString?: string;
  confirmString?: string;
  placeholderString?: string;
  sx?: SxProps;
  onCancel?: () => void;
  onConfirm?: (note: string) => void;
}

const NoteDialog: FCC<NoteDialogProps> = ({
  note,
  cancelString,
  confirmString,
  placeholderString,
  sx,
  onCancel,
  onConfirm
}) => {
  const { close } = useDialog({ dialog_id: 'noteUtenteEdit' });

  const [editedNote, setEditedNote] = useState<string>(note);

  const handleChange = (e) => {
    setEditedNote(e.target.value);
  };

  return (
    <Grid container rowSpacing={2} sx={sx}>
      <Grid item container mt={3}>
        <Textarea value={editedNote} size='medium' placeholder={placeholderString} onChange={handleChange}/>
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
        <Button
          onClick={() => {
            close();
            if (onConfirm) onConfirm(editedNote);
          }}
          size="small"
          variant="contained"
          sx={{ height: '30px' }}
        >
          {confirmString}
        </Button>
      </Grid>
    </Grid>
  );
};

export default NoteDialog;
