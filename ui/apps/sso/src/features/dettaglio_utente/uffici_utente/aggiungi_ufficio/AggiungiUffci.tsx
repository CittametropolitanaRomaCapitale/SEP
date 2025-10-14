import { FC } from 'react';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { usePostApiOfficeByUserIdOfficesMutation } from '@cmrc/services/sso';
import { dictionary } from '../dictionary';
import { useAggiungiUfficioForm } from './useAggiungiUfficiForm';
import { useDrawer } from '../../../../store/drawer/useDrawer';

const AggiungiUffici: FC = () => {
  const { query } = useRouter();
  const { closeDrawer } = useDrawer({
    drawer_id: 'aggiungiUfficiUtente'
  });
  const { structure } = useAggiungiUfficioForm();

  const [saveOfficeMutation, { isLoading }] =
    usePostApiOfficeByUserIdOfficesMutation();

  const methods = useForm({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const onSave = ({
    office
  }: {
    office?: { label: string; value: number }[];
  }) => {
    saveOfficeMutation({
      officeIdListBean: {
        office_ids: office.map((item) => item.value)
      },
      userId: Number(query?.id)
    })
      .then(() => {
        toast.success(dictionary.get('ufficiAggiunti'));
      })
      .catch(() => {
        toast.error(dictionary.get('ufficiErrore'));
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
      onSubmit={methods.handleSubmit(onSave)}
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
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            aria-label="aggiungi"
            onClick={methods.handleSubmit((values) => onSave(values))}
            loading={isLoading}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
          >
            {dictionary.get('aggiungi')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AggiungiUffici;
