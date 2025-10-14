
import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { ModelloAutomaticoDrawer } from '../ModelloAutomaticoDrawer';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';

export const AddModello = () => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'modelloAutomaticoDrawer'
  });

  return (
    <>
      <Button onClick={openDrawer} size="small" variant="contained">
        {dictionary.get('aggiungi')}
      </Button>

      <Drawer
        title={dictionary.get('aggiungiModello')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <ModelloAutomaticoDrawer />
      </Drawer>
    </>
  );
};
