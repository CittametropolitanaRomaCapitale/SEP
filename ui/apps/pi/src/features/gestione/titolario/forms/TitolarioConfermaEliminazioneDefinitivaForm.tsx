import { FCC } from '@cmrc/types/FCC';
import {
  TitolarioOutputDto,
  useDropTitolarioMutation
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useDialog } from '../../../../store/dialog/useDialog';
import { dictionary } from '../dictionary';
import ConfirmDialog from '../../../../components/ConfirmDialog';

export const TitolarioConfermaEliminazioneDefinitivaForm: FCC<{
  titolario: TitolarioOutputDto;
  onItemDropped?: (item: any) => void;
}> = ({ titolario, onItemDropped }) => {
  const { close } = useDialog({
    dialog_id: `dialogEliminaTitolario${titolario?.id}`
  });

  const [dropTitolarioMutation] = useDropTitolarioMutation();

  const onDropTitolario = async () => {
    const response = await dropTitolarioMutation({
      idTitolario: titolario?.id
    }).unwrap();
    if (response?.dropTitolario) {
      toast.success(dictionary.get('dropSuccess'));
      close();
      if (onItemDropped) {
        onItemDropped(titolario);
      }
    }
  };

  return (
    <ConfirmDialog
      message={dictionary.get('confermaEliminazioneDefinitivaFascicolo')}
      cancelString={dictionary.get('annulla')}
      confirmString={dictionary.get('elimina')}
      onConfirm={onDropTitolario}
    />
  );
};
