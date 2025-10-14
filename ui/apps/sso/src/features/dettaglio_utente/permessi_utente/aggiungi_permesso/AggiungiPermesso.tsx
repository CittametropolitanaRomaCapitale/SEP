import { FC, useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import {
  CreateMultiPermissionBean,
  CreatePermissionBean,
  usePostApiPermitMultiAddPermissionMutation
} from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { dictionary } from '../dictionary';
import { useAggiungiPermessoForm } from './useAggiungiPermessoForm';
import { useDrawer } from '../../../../store/drawer/useDrawer';

const AggiungiPermesso: FC<{ selectedRoles?: any[] }> = () => {
  const [loading, setLoading] = useState(false);

  const { query } = useRouter();
  const { closeDrawer } = useDrawer({
    drawer_id: 'aggiungiPermessoUtente'
  });
  const { structure } = useAggiungiPermessoForm();

  const [savePermitMutation] = usePostApiPermitMultiAddPermissionMutation();

  const methods = useForm<CreatePermissionBean>({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const onSave = ({
    office_id,
    roles
  }: CreateMultiPermissionBean & {
    roles?: { label: string; value: number }[];
  }) => {
    setLoading(true);
    savePermitMutation({
      createMultiPermissionBean: {
        user_id: Number(query.id),
        office_id,
        role_ids: roles.map((role) => role.value)
      }
    })
      .unwrap()
      .then(() => {
        toast.success(dictionary.get('permessoAggiunto'));
      })
      .catch(() => {
        toast.error(dictionary.get('permessoErrore'));
      })
      .finally(() => {
        setLoading(false);
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
            disabled={loading}
            sx={{ height: '30px', mr: 1 }}
            aria-label="annulla"
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values))}
            loading={loading}
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

export default AggiungiPermesso;
