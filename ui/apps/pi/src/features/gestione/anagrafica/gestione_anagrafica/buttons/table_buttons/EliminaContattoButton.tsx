import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import { AnagraficaDto, useDeleteContattoMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useDialog } from '../../../../../../store/dialog/useDialog';
import { useGetQueryAnagraficaList } from '../../hooks/useDataAnagraficaList';
import { dictionary } from '../dictionary';
import ConfirmDialog from '../../../../../../components/ConfirmDialog';

export const EliminaContattoButton: FCC<{ contatto?: AnagraficaDto }> = ({
  contatto
}) => {
  const { open, close, isOpen } = useDialog({
    dialog_id: `eliminaContatto_${contatto?.id}`
  });

  const { refetch } = useGetQueryAnagraficaList();
  const [deleteContattoMutation, { isLoading }] = useDeleteContattoMutation();

  const onDeleteContatto = async () => {
    try {
      const response = await deleteContattoMutation({ id: contatto?.id }).unwrap();
      if (response?.deleteContatto) {
        toast.success(dictionary.get('contattoEliminato'));
        refetch();
      }
    }
    catch (e) {
      toast.error(dictionary.get('contattoNonEliminato'));
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
        <DeleteIcon titleAccess={dictionary.get('eliminaContatto')} />
      </LoadingButton>

      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaContatto')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminazioneContatto')}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onDeleteContatto}
        />
      </Dialog>
    </>
  );
};
