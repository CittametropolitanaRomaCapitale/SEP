import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import Button from '@mui/material/Button';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { useDialog } from '../../../../../store/dialog/useDialog';
import { GestisciAnnullamentoForm } from '../GestisciAnnullamentoForm';
import { dictionary } from '../dictionary';

export interface GestisciAnnullamentoProps {
  isDisabled: boolean,
  protocolloData: ProtocolloBaseFragment
}

export const GestisciAnnullamento: FCC<GestisciAnnullamentoProps> = ({ isDisabled, protocolloData }) => {
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
        {dictionary.get('gestRichiestaAnnullamento')}
      </Button>
      <Dialog title={dictionary.get('gestRichiestaTitle')} open={isOpen} onClose={closeDialog}>
        <GestisciAnnullamentoForm protocolloData={protocolloData} />
      </Dialog>
    </>
  )
};