import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HistoryIcon from '@mui/icons-material/History';
import Edit from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Drawer from '@cmrc/ui/components/Drawer';
import toast from '@cmrc/ui/components/Toast';
import { useGetUtente } from './useGetUtente';
import { useDrawer } from '../../store/drawer/useDrawer';
import { dictionary } from './dictionary';
import CronologiaUtente from './CronologiaUtente';
import { Chip, IconButton } from '@mui/material';
import { useDialog } from '../../store/dialog/useDialog';
import NoteDialog from './note_utente/dialog_note';
import Dialog from '@cmrc/ui/components/Dialog';
import { PostApiUserByIdNoteApiArg, usePostApiUserByIdNoteMutation } from '@cmrc/services/sso';

export const HeaderUtente = () => {
  const { data: userData, refetch } = useGetUtente();
  const [saveNoteMutation] = usePostApiUserByIdNoteMutation();

  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'cronologiaUtente'
  });

  const { open: openDialog, close: closeDialog, isOpen: isOpenDialog } = useDialog({
    dialog_id: 'noteUtenteEdit'
  });

  const saveNote = (note: string) => {
    saveNoteMutation({
      id:userData?.id,
      note: note
    })
    .unwrap()
    .then(() => {
      toast.success(dictionary.get('notaAggiornata'));
      refetch();
      closeDialog();
    })
    .catch(() => {
      toast.error(dictionary.get('notaErrore'));
    });
  }; 

  return (
    <>
      <Grid
        sx={{
          m: 2,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'top',
          borderBottom: '2px solid #E6E8F0'
        }}
      >
        <Grid>
          {userData && (
            <>
              <Typography fontSize="1.4rem" fontWeight="700">
                {userData?.username}
                {" "}
                <Chip 
                  sx={{ml:1}}
                  size='small' 
                  label={userData?.enabled === null || userData?.enabled ? dictionary.get('userEnabled') : dictionary.get('userDisabled')} 
                  color={userData?.enabled === null || userData?.enabled ? 'success' : 'error'} 
                />
              </Typography>
              <Grid container direction="row" alignItems="baseline">
                <Grid
                  item
                  sx={(theme) => ({
                    color: theme.palette.grey[600],
                    fontWeight: 600,
                    fontSize: '1rem'
                  })}
                >
                  {dictionary.get('nome')}
                </Grid>
                <Typography sx={{ fontWeight: '600', ml: 1 }}>
                  {userData?.firstName}
                </Typography>
                <Grid
                  item
                  sx={(theme) => ({
                    color: theme.palette.grey[600],
                    fontWeight: 600,
                    fontSize: '1rem',
                    ml:4
                  })}
                >
                  {dictionary.get('cognome')}
                </Grid>
                <Typography sx={{ fontWeight: '600', ml: 1 }}>
                  {userData?.lastName}
                </Typography>
              </Grid>
              <Grid container direction="row">
                <Grid
                  item
                  sx={(theme) => ({
                    color: theme.palette.grey[600],
                    fontWeight: 600,
                    fontSize: '1rem'
                  })}
                >
                  {dictionary.get('email')}
                </Grid>
                <Typography sx={{ fontWeight: '600', ml: 1 }}>
                  {userData?.email}
                </Typography>
              </Grid>
              <Grid container direction="row">
                <Grid
                  item
                  sx={(theme) => ({
                    color: theme.palette.grey[600],
                    fontWeight: 600,
                    fontSize: '1rem',
                    mt:1
                  })}
                >
                  {dictionary.get('note')}
                </Grid>
                <IconButton
                  sx={{mt:0}}
                  title={dictionary.get('editNoteButtonTitle')}
                  onClick={() => {openDialog();}}
                  color='primary'
                  size='small'>
                  <Edit />
                </IconButton>
              </Grid>
                <Typography variant='caption' sx={{ whiteSpace: 'pre-line', fontWeight: '400', mt:2 }}>
                  {userData?.note}
                </Typography>
            </>
          )}
        </Grid>

        <Grid>
          <Button
            variant="outlined"
            size="small"
            sx={{ height: '30px' }}
            startIcon={<HistoryIcon />}
            onClick={openDrawer}
            aria-label="cronologia"
          >
            {dictionary.get('cronologia')}
          </Button>
        </Grid>
      </Grid>
      <Drawer
        title={dictionary.get('cronologiaUtente', {
          name: userData?.username
        })}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <CronologiaUtente />
      </Drawer>
      <Dialog
        fullWidth={false}
        open={isOpenDialog}
        onClose={closeDialog}
        title={dictionary.get('updateNote')}
      >
        <NoteDialog 
          cancelString={dictionary.get('cancelNote')}
          confirmString={dictionary.get('editNote')}
          placeholderString={dictionary.get('editNotePlaceholder')}
          onConfirm={(newNote: string) => {saveNote(newNote); closeDialog(); }}
          note={userData?.note}  
        />
      </Dialog>
    </>
  );
};
