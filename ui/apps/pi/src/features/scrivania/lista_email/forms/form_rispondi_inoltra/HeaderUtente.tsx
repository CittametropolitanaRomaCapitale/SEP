import Typography from '@mui/material/Typography';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { Avatar, Box, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const HeaderUtente = () => {
  const { user } = useAuth();

  return (
    <Box padding={1} borderBottom={1} borderColor="silver">
      <Grid padding={1} container direction="column">
        {user && (
          <Grid item>
            <Box display="flex" alignItems="center">
              <AccountCircleIcon sx={{ width: 40, height: 40, mr: 2 }} />
              <Box flexGrow={1}>
                <Typography variant="body1" fontWeight="700">{user?.name}</Typography>
                {/* TODO: gestire la mail dell'utente loggato */}
                <Typography variant="body2"><b />protocollo.user@cittametropolitanaroma.it</Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
