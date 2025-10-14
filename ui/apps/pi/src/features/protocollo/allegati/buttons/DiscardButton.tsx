import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Dialog from '@cmrc/ui/components/Dialog';
import { AllegatoBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { useDialog } from '../../../../store/dialog/useDialog';
import { DiscardAllegato } from '../DiscardAllegato';
import { dictionary } from '../dictionary';

export interface DiscardProps {
  allegatoData: AllegatoBaseFragment;
  icon: React.ReactElement;
  onDiscard: (allegato: AllegatoBaseFragment) => void;
}

export const DiscardButton: FCC<DiscardProps> = ({
  allegatoData,
  icon,
  onDiscard
}) => {
  const {
    open,
    isOpen,
    close: closeDialog
  } = useDialog({
    dialog_id: `dialogDiscardAllegato_${allegatoData?.id}`
  });
  return (
    <>
      <Button
        onClick={() => {
          open();
        }}
        size="small"
      >
        {icon}
      </Button>
      <Dialog
        title={dictionary.get('discardAllegato')}
        open={isOpen}
        onClose={closeDialog}
      >
        <DiscardAllegato allegatoData={allegatoData} onDiscard={onDiscard} />
      </Dialog>
    </>
  );
};
