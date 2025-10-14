import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import Button from '@mui/material/Button';
import { useDialog } from '../../../../../store/dialog/useDialog';
import { AnnullaProtocollo } from '../AnnullaProtocollo';

export interface AnnullamentoProps {
  action: string,
  isDisabled: boolean,
  protocolloData: ProtocolloBaseFragment
}

export const Annullamento: FCC<AnnullamentoProps> = ({ action, isDisabled, protocolloData }) => {
  const { open, isOpen, close: closeDialog } = useDialog({
    dialog_id: 'dialogAnnulla'
  });

  return (
    <>
      <Button
        onClick={open}
        disabled={isDisabled}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
      >
        {action}
      </Button>
      <Dialog title={action} open={isOpen} onClose={closeDialog}>
        <AnnullaProtocollo action={action} protocolloData={protocolloData} />
      </Dialog>
    </>
  )
};