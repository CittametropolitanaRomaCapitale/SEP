import { FC, useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import {
  OfficeInput,
  usePostApiOfficeMutation,
  usePutApiOfficeByOfficeIdMutation
} from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { dictionary } from '../dictionary';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { useUfficioForm } from './useUfficioForm';
import { useFormState } from '../../../store/form/useForm';

const Ufficio: FC<{ drawer_id: string }> = ({ drawer_id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { closeDrawer } = useDrawer({
    drawer_id
  });

  const { defaultValues, setDefaultValues } = useFormState({
    form_id: 'formUfficio'
  });

  const { structure } = useUfficioForm();

  const [saveOfficeMutation] = usePostApiOfficeMutation();
  const [updateOfficeMutation] = usePutApiOfficeByOfficeIdMutation();

  const methods = useForm({
    defaultValues,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const onSave = ({
    name,
    code,
    description,
    service,
    belonging_offices,
    apri_subito,
    blocked,
    id
  }: OfficeInput & {
    apri_subito?: boolean;
    belonging_offices?: { value: number }[];
    id?: number;
  }) => {
    setLoading(true);

    if (id) {
      updateOfficeMutation({
        officeId: id,
        officeInput: {
          name,
          code,
          description,
          service,
          blocked,
          belonging_offices: (belonging_offices || []).map(
            (item: { value: number }) => item?.value
          )
        }
      })
        .unwrap()
        .then(() => {
          toast.success(dictionary.get('ufficioModificato'));
        })
        .catch(() => {
          toast.error(dictionary.get('ufficioErrore'));
        })
        .finally(() => {
          setLoading(false);
          setDefaultValues({ default_values: null });
          closeDrawer();
          if (apri_subito) {
            router.push(`/uffici/${id}`);
          }
        });
    } else {
      saveOfficeMutation({
        officeInput: {
          name,
          code,
          description,
          service,
          belonging_offices: (belonging_offices || []).map(
            (item: { value: number }) => item?.value
          )
        }
      })
        .unwrap()
        .then((data) => {
          toast.success(dictionary.get('ufficioCreato'));
          if (apri_subito) {
            router.push(`/uffici/${data?.id}`);
          }
        })
        .catch(() => {
          toast.error(dictionary.get('ufficioErrore'));
        })
        .finally(() => {
          setLoading(false);
          setDefaultValues({ default_values: null });
          closeDrawer();
        });
    }
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
            aria-label="annulla-ufficio"
            onClick={() => {
              setDefaultValues({ default_values: null });
              closeDrawer();
            }}
            size="small"
            disabled={loading}
            sx={{ height: '30px', mr: 1 }}
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            aria-label="salva-ufficio"
            onClick={methods.handleSubmit((values) => onSave(values))}
            loading={loading}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
          >
            {dictionary.get('salva')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Ufficio;
