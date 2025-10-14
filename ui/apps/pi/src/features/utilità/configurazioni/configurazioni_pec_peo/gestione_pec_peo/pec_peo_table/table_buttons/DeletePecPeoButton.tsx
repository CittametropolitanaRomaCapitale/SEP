import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import { PecPeo, useDeletePecPeoConfigurationMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import ConfirmDialog from '../../../../../../../components/ConfirmDialog';
import { useDialog } from '../../../../../../../store/dialog/useDialog';
import { useGetQueryPecPeoList } from '../../useDataPecPeo';
import { dictionary } from './dictionary';

export const DeletePecPeoButton: FCC<{ configurazione?: PecPeo }> = ({
  configurazione
}) => {
  const { open, close, isOpen } = useDialog({
    dialog_id: `deletePecPeo_${configurazione?.id}`
  });

  const { refetch } = useGetQueryPecPeoList();
  const [deletePecPeo, { isLoading }] = useDeletePecPeoConfigurationMutation();

  const onDeletePecpeo = async () => {
    const response = await deletePecPeo({ id: configurazione?.id }).unwrap();
    if (response?.deleteConfiguration) {
      toast.success(dictionary.get('configurazioneEliminata'));
      refetch();
    }
  };

  return (
    <>
      <LoadingButton
        loading={isLoading}
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={open}
      >
        <DeleteIcon titleAccess={dictionary.get('eliminaPecPeo')}/>
      </LoadingButton>

      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaPecPeo')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminaPecpeo')}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onDeletePecpeo}
        />
      </Dialog>
    </>
  );
};
