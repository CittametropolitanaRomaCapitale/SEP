import { FC, useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  SSOApi,
  useDeleteApiDocsDeleteAttachmentByIdMutation,
  usePostApiPermitAddDelegationMutation,
  usePutApiPermitUpdateDelegationByIdMutation
} from '@cmrc/services/sso';
import { dictionary } from '../dictionary';
import { useDelegaForm } from './useDelegaForm';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { Allegati } from '../../../../components/Allegati';
import { useFormState } from '../../../../store/form/useFormState';
import { useUploadAllegato } from '../uploadDelega';
import { useDialog } from '../../../../store/dialog/useDialog';
import { DeleteDialog } from '../../../../components/DeleteDialog';
import { useDispatch } from '../../../../store';

const DelegaPermessi: FC = () => {
  const dispatch = useDispatch();
  const UPLOAD_PATH = 'api/docs/load_attachment';
  const [loading, setLoading] = useState(false);
  const [allegato, setAllegato] = useState(null);
  const { uploadAllegato } = useUploadAllegato();
  const { query } = useRouter();
  const { closeDrawer } = useDrawer({
    drawer_id: 'delegaPermesso'
  });
  const { defaultValues, setDefaultValues } = useFormState({
    form_id: 'formDelegaPermessi'
  });

  const { isOpen, close, content, openWithContent } = useDialog({
    dialog_id: `cancellaAllegato_${defaultValues?.id}`
  });

  const methods = useForm<any>({
    defaultValues,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const { structure } = useDelegaForm({
    userDisabled: defaultValues && true,
    methods
  });

  const [saveDelegationMutation] = usePostApiPermitAddDelegationMutation();
  const [updateDelegationMutation] =
    usePutApiPermitUpdateDelegationByIdMutation();
  const [deleteAllegato, { isLoading: isLoadingDeleteAllegato }] =
    useDeleteApiDocsDeleteAttachmentByIdMutation();

  const onSave = ({
    delegation_end,
    delegation_start,
    note,
    user_id: to_user_id,
    application,
    offices,
    id
  }) => {
    setLoading(true);
    if (id) {
      updateDelegationMutation({
        id,
        updateDelegationDatesBean: {
          delegation_start,
          delegation_end,
          applicationId: application.value,
          cdr_code: offices.value,
          note
        }
      })
        .unwrap()
        .then(() => {
          if (allegato) {
            uploadAllegato({
              file: allegato,
              id,
              url: `${process.env.NEXT_PUBLIC_API_URL}/${UPLOAD_PATH}`,
              onUpload: () =>
                dispatch(
                  SSOApi.util.invalidateTags([
                    { type: 'UserByUserIdDelegationsSent' as never }
                  ])
                )
            });
          }
          toast.success(dictionary.get('delegaModificata'));
        })
        .catch((error?: any) => {
          if (error?.data?.message) {
            toast.error(error?.data?.message);
          } else {
            toast.error(dictionary.get('delegaErrore'));
          }
        })
        .finally(() => {
          setLoading(false);
          setDefaultValues({ default_values: null });
          setAllegato(null);
          closeDrawer();
        });
    } else {
      saveDelegationMutation({
        createDelegationBean: {
          user_id: Number(query.id),
          to_user_id,
          delegation_start,
          delegation_end,
          applicationId: application.value,
          cdr_code_list: offices.map((office) => office.value),
          note
        }
      })
        .unwrap()
        .then((data: any) => {
          if (allegato) {
            uploadAllegato({
              file: allegato,
              id: data?.map((delegation) => delegation?.id).join(','),
              url: `${process.env.NEXT_PUBLIC_API_URL}/${UPLOAD_PATH}`,
              onUpload: () =>
                dispatch(
                  SSOApi.util.invalidateTags([
                    { type: 'UserByUserIdDelegationsSent' as never }
                  ])
                )
            });
          }
          toast.success(dictionary.get('delegaAggiunta'));
        })
        .catch((error?: any) => {
          if (error?.data?.message) {
            toast.error(error?.data?.message);
          } else {
            toast.error(dictionary.get('delegaErrore'));
          }
        })
        .finally(() => {
          setLoading(false);
          setDefaultValues({ default_values: null });
          setAllegato(null);
          closeDrawer();
        });
    }
  };

  const onDownloadAllegato = (id) => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/docs/download_attachment/${id}`,
      '_blank'
    );
  };

  const onOpenDeleteAllegato = ({ allegatoToDelete }) => {
    openWithContent({
      content: {
        name: allegatoToDelete.url || '-',
        id: allegatoToDelete.id || null
      }
    });
  };

  const onDeleteAllegato = () => {
    deleteAllegato({ id: content?.id })
      .unwrap()
      .then(() => {
        toast.success(dictionary.get('fileEliminato'));
      })
      .catch(() => {
        toast.error(dictionary.get('delegaErrore'));
      })
      .finally(() => {
        close();
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
        <Allegati
          inputKey="delegaPermessiAllegati"
          disabled={false}
          label={dictionary.get('caricaFile')}
          title={dictionary.get('allegati')}
          attachment={defaultValues?.attachment}
          onUploadAllegato={setAllegato}
          onDownloadAllegato={onDownloadAllegato}
          fileToUpload={allegato}
          onDeleteAllegato={onOpenDeleteAllegato}
        />
      </Grid>
      <Grid item>
        <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button
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
            onClick={methods.handleSubmit((values) => onSave(values))}
            loading={loading}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
            aria-label="salva"
          >
            {dictionary.get('salva')}
          </LoadingButton>
        </Grid>
      </Grid>
      <DeleteDialog
        title={dictionary.get('cancellaAllegato')}
        bodyText={dictionary.get('confermaCancellaAllegato', {
          name: content?.name || ''
        })}
        close={close}
        isOpen={isOpen}
        onDelete={onDeleteAllegato}
        isLoading={isLoadingDeleteAllegato}
      />
    </Grid>
  );
};

export default DelegaPermessi;
