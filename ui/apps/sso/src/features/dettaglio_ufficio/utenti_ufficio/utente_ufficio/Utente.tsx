import { FC } from 'react';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { usePostApiOfficeByOfficeIdUsersMutation } from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { useUtenteForm } from '../utente/useUtenteForm';
import { useFormState } from '../../../../store/form/useForm';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { dictionary } from '../../dictionary';

const Utente: FC<{ drawer_id: string }> = ({ drawer_id }) => {
  const { query } = useRouter();

  const { closeDrawer } = useDrawer({
    drawer_id
  });

  const { defaultValues, setDefaultValues } = useFormState({
    form_id: 'formUtentiUfficio'
  });

  const { structure } = useUtenteForm();

  const [saveUsersMutation, { isLoading }] =
    usePostApiOfficeByOfficeIdUsersMutation();

  const methods = useForm({
    defaultValues,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const onSave = ({ users }: { users: { label: string; value: number }[] }) => {
    saveUsersMutation({
      officeId: Number(query?.id),
      userIdListBean: {
        user_ids: users.map((user) => user.value)
      }
    })
      .then(() => {
        toast.success(dictionary.get('utentiAggiunti'));
      })
      .catch(() => {
        toast.error(dictionary.get('errore'));
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
            onClick={() => {
              setDefaultValues({ default_values: null });
              closeDrawer();
            }}
            size="small"
            disabled={isLoading}
            sx={{ height: '30px', mr: 1 }}
            aria-label="annulla"
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values as any))}
            loading={isLoading}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
            aria-label="salva"
          >
            {dictionary.get('salva')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Utente;
