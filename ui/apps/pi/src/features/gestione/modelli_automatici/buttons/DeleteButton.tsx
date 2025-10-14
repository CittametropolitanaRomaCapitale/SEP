import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import {
  ModelloAutomaticoDto,
  useDeleteModelloAutomaticoMutation
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useGetQueryModelliConfig } from '../hooks/useDataModelliConfig';
import { dictionary } from '../dictionary';
import { useDialog } from '../../../../store/dialog/useDialog';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export const DeleteButton: FCC<{ modelloData?: ModelloAutomaticoDto }> = ({
  modelloData
}) => {
  const { open, close, isOpen } = useDialog({
    dialog_id: `deleteModello_${modelloData?.id}`
  });

  const { refetch } = useGetQueryModelliConfig();
  const [deleteModello, { isLoading }] = useDeleteModelloAutomaticoMutation();

  const onDeleteModello = async () => {
    const response = await deleteModello({ id: modelloData?.id }).unwrap();
    if (response?.deleteModelloAutomatico) {
      toast.success(dictionary.get('modelloEliminato'));
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
        <DeleteIcon titleAccess={dictionary.get('eliminaModello')} />
      </LoadingButton>

      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaModello')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminaModello', {
            nome: modelloData?.nomeModello
          })}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onDeleteModello}
        />
      </Dialog>
    </>
  );
};
