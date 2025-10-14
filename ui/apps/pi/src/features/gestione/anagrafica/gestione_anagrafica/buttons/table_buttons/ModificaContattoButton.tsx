import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { AnagraficaDto } from '@cmrc/services/src/app/piapi/generated';
import { AnagraficaDrawer } from '../../components/AnagraficaDrawer';
import { dictionary } from '../dictionary';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';

export const ModificaContattoButton: FCC<{ contatto?: AnagraficaDto }> = ({
  contatto
}) => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: `modificaContatto_${contatto?.id}`
  });

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={openDrawer}
      >
        <EditIcon titleAccess={dictionary.get('modificaContatto')} />
      </Button>

      <Drawer
        title={dictionary.get('modificaContatto')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <AnagraficaDrawer data={contatto} from='anagrafica' />
      </Drawer>
    </>
  );
};
