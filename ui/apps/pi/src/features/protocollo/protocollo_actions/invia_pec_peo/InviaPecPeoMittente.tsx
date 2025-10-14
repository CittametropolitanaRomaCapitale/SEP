import Typography from '@mui/material/Typography';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { Box, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { UseFormReturn } from 'react-hook-form';
import { useOffice } from '@cmrc/auth/useOffice';
import { ProtocolloForm } from '../../protocollo_form/hooks/useDestinatariProtocolloForm';
import { useInviaPecPeoMittenteForm } from './hooks/useInviaPecPeoMittenteForm';

export interface DestinatariProtocolloFormProps {
  readMode?: boolean;
  tipoRegistrazioneSel: string;
  metodoSpedizioneSel: string;
  formMethod: UseFormReturn<ProtocolloForm, any>;
  selectedAction: string;
}

export const InviaPecPeoMittente = ({ formMethod, tipologiaPosta }) => {
  const { user } = useAuth();
  const { cdr, shortCdrDesc } = useOffice();
  const { structure } = useInviaPecPeoMittenteForm(formMethod,tipologiaPosta);

  return (
    <Box marginBottom={2} borderBottom={1} paddingBottom={2} borderColor="silver">
      <Grid container direction="column" spacing={2} padding={1}>
        {user && (
          <><Grid item>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <AccountCircleIcon sx={{ width: 40, height: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body1" fontWeight="700">{user?.name}</Typography>
                  <Typography variant="overline">{`${cdr} - ${shortCdrDesc}`}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid><Grid item>
              <FormGenerator methods={formMethod} structure={structure} />
            </Grid></>
        )}
      </Grid>
    </Box>
  );
};
