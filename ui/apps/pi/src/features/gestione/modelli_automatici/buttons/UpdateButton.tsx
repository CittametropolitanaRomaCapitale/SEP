import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { ModelloAutomaticoDto } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { ModelloAutomaticoDrawer } from '../ModelloAutomaticoDrawer';

export const UpdateButton: FCC<{ modelloData?: ModelloAutomaticoDto }> = ({
  modelloData
}) => {
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawer({
    drawer_id: `ModelloAutomatico_${modelloData?.id}`
  });

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={openDrawer}
      >
        <EditIcon titleAccess={dictionary.get('modificaModello')} />
      </Button>

      <Drawer
        title={dictionary.get('modificaModello')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <ModelloAutomaticoDrawer data={modelloData} />
      </Drawer>
    </>
  );
};
