import { FCC } from '@cmrc/types/FCC';
import { TitolarioOutputDto, useDeleteTitolarioMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useDialog } from '../../../../store/dialog/useDialog';
import { dictionary } from '../dictionary';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export const TitolarioConfermaEliminazioneForm: FCC<{ titolario: TitolarioOutputDto, onItemDeleted?: (item: any) => void }> = ({
  titolario,
  onItemDeleted
}) => {
  const { close } = useDialog({
    dialog_id: `dialogEliminaTitolario${titolario?.id}`
  });

  const [deleteTitolarioMutation] = useDeleteTitolarioMutation();

  const onDeleteTitolario = async () => {
    const response = await deleteTitolarioMutation({ idTitolario: titolario?.id }).unwrap();
    if (response?.deleteTitolario) {
      toast.success(dictionary.get('deleteSuccess'));
      close();
      if (onItemDeleted) {
        onItemDeleted(titolario);
      }
    }
  }

  return (
    <ConfirmDialog
      message={dictionary.get('confermaEliminazioneTitolarioMessage')}
      cancelString={dictionary.get('annulla')}
      confirmString={dictionary.get('elimina')}
      onConfirm={onDeleteTitolario}
    />
  );
};
