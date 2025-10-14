import Dialog from '@cmrc/ui/components/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../hooks/use-auth';
import toast from '../Toast';

export const NoOfficeFoundPopover = () => {
  const { logout } = useAuth();

  const onLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return (
    <Dialog
      open
      title="Nessun ufficio trovato"
      fullWidth={false}
      hideCloseButton
    >
      <Stack>
        <Typography>
          Non sono presenti uffici associati alla tua utenza.
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          sx={{ paddingTop: '20px' }}
        >
          <Button variant="contained" size="small" onClick={onLogout}>
            Ok
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
