import { FCC } from '@cmrc/types/FCC';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { VisibilitaTitolario } from '@cmrc/services/src/app/piapi/generated';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { AggiungiPermessiForm } from '../aggiungi_permessi/AggiungiPermessiForm';
import { dictionary } from '../dictionary';

export const ModificaPermessoButton: FCC<{ permesso?: VisibilitaTitolario }> = ({
  permesso
}) => {
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawer({
    drawer_id: `titolarioPermessiDrawer_${permesso?.id}`
  });

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={openDrawer}
      >
        <EditIcon titleAccess={dictionary.get('modificaPermesso')} />
      </Button>
      <Drawer
        title={dictionary.get('modificaPermesso')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <AggiungiPermessiForm />
      </Drawer>
    </>
  );
};
