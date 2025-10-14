import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Dialog from '@cmrc/ui/components/Dialog';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { useDialog } from '../../../../store/dialog/useDialog';
import { ResumeAllegato } from '../ResumeAllegato';
import { dictionary } from '../dictionary';

export interface ResumeProps {
  allegatoData: ProtocolloBaseFragment;
  icon: React.ReactElement;
  onResume: (protocollo: ProtocolloBaseFragment) => void;
}

export const ResumeButton: FCC<ResumeProps> = ({
  allegatoData,
  icon,
  onResume
}) => {
  const {
    open,
    isOpen,
    close: closeDialog
  } = useDialog({
    dialog_id: `dialogResumeAllegato_${allegatoData?.id}`
  });
  return (
    <>
      <Button onClick={() => open()} size="small">
        {icon}
      </Button>
      <Dialog
        title={dictionary.get('resumeAllegato')}
        open={isOpen}
        onClose={closeDialog}
      >
        <ResumeAllegato allegatoData={allegatoData} onResume={onResume} />
      </Dialog>
    </>
  );
};
