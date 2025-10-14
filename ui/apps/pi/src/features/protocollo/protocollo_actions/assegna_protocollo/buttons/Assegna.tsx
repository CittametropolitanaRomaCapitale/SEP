import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Dialog from '@cmrc/ui/components/Dialog';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { useDialog } from '../../../../../store/dialog/useDialog';
import { AssegnaProtocollo } from '../AssegnaProtocollo';
import { dictionary } from '../dictionary';

export interface AssegnaProps {
  protocolloData: ProtocolloBaseFragment;
  disabledAssegna: boolean;
}

export const Assegna: FCC<AssegnaProps> = ({protocolloData, disabledAssegna}) => {
  const { open, isOpen, close: closeDialog } = useDialog({
    dialog_id: 'dialogAssegnaProtocolloForm'
  });
  return (
    <>
      <Button
        disabled={disabledAssegna || isOpen}
        onClick={() => open()}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
      >
        {dictionary.get('assegna')}
      </Button>
      <Dialog title={dictionary.get('assegna')} open={isOpen} onClose={closeDialog} >
        <AssegnaProtocollo protocolloData={protocolloData}/>
      </Dialog>
    </>
  )
};