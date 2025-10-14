import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import { Gruppo, useDeleteGruppoMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useDialog } from '../../../../../../../store/dialog/useDialog';
import ConfirmDialog from '../../../../../../../components/ConfirmDialog';
import { useGetQueryGruppiList } from '../../hooks/useDataGruppiList';
import { dictionary } from '../dictionary';

export const EliminaGruppoButton: FCC<{ gruppo?: Gruppo }> = ({
  gruppo
}) => {
  const { refetch } = useGetQueryGruppiList();
  const [deleteGruppoMutation, { isLoading }] = useDeleteGruppoMutation();
  const { open, close, isOpen } = useDialog({
    dialog_id: `eliminaGruppo_${gruppo?.id}`
  });

  const onDeleteGruppo = async () => {
    try {
      const response = await deleteGruppoMutation({ groupId: gruppo?.id }).unwrap();
      if (response?.deleteGruppo) {
        toast.success(dictionary.get('gruppoEliminato'));
        refetch();
      }
    }
    catch (e) {
      toast.error(dictionary.get('gruppoNonEliminato'));
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
        <DeleteIcon titleAccess={dictionary.get('eliminaGruppo')} />
      </LoadingButton>

      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaGruppo')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminazioneGruppo')}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onDeleteGruppo}
        />
      </Dialog>
    </>
  );
};
