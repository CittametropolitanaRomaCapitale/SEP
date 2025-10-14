import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import {
  PecEscluseRispostaAutomatica,
  useDeletePecEsclusaMutation
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import ConfirmDialog from '../../../../../../../components/ConfirmDialog';
import { useDialog } from '../../../../../../../store/dialog/useDialog';
import { useGetQueryPecEscluseList } from '../../hooks/useDataPecEscluseRispostaAutomatica';
import { dictionary } from '../../dictionary';

type DeletePecEsclusaButtonProps = {
  pecEsclusaSelected: PecEscluseRispostaAutomatica;
};

export const DeletePecEsclusaButton: FCC<DeletePecEsclusaButtonProps> = ({
  pecEsclusaSelected
}) => {
  const { open, close, isOpen } = useDialog({
    dialog_id: `deletePecEsclusa_${pecEsclusaSelected?.id}`
  });
  const { refetch } = useGetQueryPecEscluseList();
  const [deletePecEsclusa, { isLoading }] = useDeletePecEsclusaMutation();

  const onDeletePecEsclusa = async () => {
    const response = await deletePecEsclusa({
      id: pecEsclusaSelected?.id
    }).unwrap();
    if (response?.deletePecEsclusa) {
      toast.success(dictionary.get('successEliminazione'));
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
        <DeleteIcon titleAccess={dictionary.get('eliminaPecEsclusa')} />
      </LoadingButton>

      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaPecEsclusa')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminaPecEsclusa', {
            title: `"${pecEsclusaSelected?.indirizzo}"`
          })}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onDeletePecEsclusa}
        />
      </Dialog>
    </>
  );
};
