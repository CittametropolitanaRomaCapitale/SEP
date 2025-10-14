import { FC } from 'react';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { usePutApiAdminRoleByRoleIdUserAndUserIdMutation } from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { dictionary } from '../dictionary';
import {
  AdminRole,
  useAggiungiRuoloAmministrazioneForm
} from './useAggiungiRuoloAmministrazioneForm';
import { useDrawer } from '../../../../store/drawer/useDrawer';

const AggiungiRuoloAmministrazione: FC = () => {
  const { query } = useRouter();
  const { closeDrawer } = useDrawer({
    drawer_id: 'aggiungiRuoloAmministrazioneUtente'
  });
  const { structure } = useAggiungiRuoloAmministrazioneForm();

  const [saveAdminRoleMutation, { isLoading }] =
    usePutApiAdminRoleByRoleIdUserAndUserIdMutation();

  const methods = useForm<AdminRole>({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const onSave = ({ role }: { role?: { label: string; value: number } }) => {
    saveAdminRoleMutation({
      userId: Number(query.id),
      roleId: role?.value
    })
      .unwrap()
      .then(() => {
        toast.success(dictionary.get('ruoloAggiunto'));
      })
      .catch(() => {
        toast.error(dictionary.get('ruoloErrore'));
      })
      .finally(() => {
        closeDrawer();
      });
  };

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            onClick={closeDrawer}
            size="small"
            disabled={isLoading}
            sx={{ height: '30px', mr: 1 }}
            aria-label="annulla"
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values))}
            loading={isLoading}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
            aria-label="aggiungi"
          >
            {dictionary.get('aggiungi')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AggiungiRuoloAmministrazione;
