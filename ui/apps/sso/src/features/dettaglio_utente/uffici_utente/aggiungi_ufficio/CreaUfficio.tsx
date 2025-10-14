import Dialog from '@cmrc/ui/components/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  OfficeInput,
  usePostApiOfficeMutation,
  SSOApi as api,
  Office
} from '@cmrc/services/sso';
import toast from '@cmrc/ui/components/Toast';
import { useEffect } from 'react';
import { dictionary } from '../dictionary';

export const CreaUfficio = ({ close, isOpen, getValues, setval, setValue }) => {
  const methods = useForm<OfficeInput>({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    methods.setValue('name', getValues.default_name);
    methods.setValue('description', getValues.default_name);
  }, [getValues, methods]);

  const structure: BaseInputProps<OfficeInput>[] = [
    {
      type: 'text',
      name: 'name',
      required: true,
      label: dictionary.get('nomeUfficio'),
      placeholder: dictionary.get('nomeUfficio')
    },
    {
      type: 'text',
      name: 'description',
      required: true,
      label: dictionary.get('descrizioneUfficio'),
      placeholder: dictionary.get('descrizioneUfficio'),
      componentProps: {
        multiline: true,
        minRows: 3
      }
    }
  ];

  const [createOfficeMutation, { isLoading }] = usePostApiOfficeMutation();
  const [trigger] = api.endpoints.getApiOffice.useLazyQuery();

  const onCreate = (officeInput: OfficeInput) => {
    createOfficeMutation({
      officeInput
    })
      .unwrap()
      .then(() => {
        trigger({
          by: 'id',
          desc: false
        }).then(({ data: { data: officeData } }) => {
          const lastOffice: Office = (officeData as Office[])[
            ((officeData as Office[]).length as unknown as number) - 1
          ];

          if (getValues.office.length) {
            setval([
              ...getValues.office,
              { label: lastOffice.name, value: lastOffice.id }
            ]);

            setValue('office', [
              ...getValues.office,
              { label: lastOffice.name, value: lastOffice.id }
            ]);
          } else {
            setValue('office', [
              { label: lastOffice.name, value: lastOffice.id }
            ]);
            setval([{ label: lastOffice.name, value: lastOffice.id }]);
          }
        });

        toast.success(dictionary.get('ufficioCreato'));
      })
      .catch(() => {
        toast.error(dictionary.get('ufficioErrore'));
      });

    close();
  };

  return (
    <Dialog
      title={dictionary.get('creaUfficio')}
      onClose={close}
      open={isOpen}
      fullWidth={false}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <FormGenerator methods={methods} structure={structure} />
          </Grid>
          <Grid
            container
            justifyContent="flex-end"
            alignItems="center"
            columnSpacing={1}
          >
            <Grid item>
              <Button onClick={close}>Annulla</Button>
            </Grid>
            <Grid item>
              <LoadingButton
                onClick={methods.handleSubmit((values) => onCreate(values))}
                disabled={isLoading}
                loading={isLoading}
                size="small"
                variant="contained"
              >
                {dictionary.get('creaUfficio')}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};
