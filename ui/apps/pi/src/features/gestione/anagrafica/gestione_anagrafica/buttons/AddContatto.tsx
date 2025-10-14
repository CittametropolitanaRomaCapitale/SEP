import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { useDrawer } from '../../../../../store/drawer/useDrawer';
import { AnagraficaDrawer } from '../components/AnagraficaDrawer';
import { dictionary } from './dictionary';

export const AddContatto = () => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'anagraficaDrawer'
  });

  return (
    <>
      <Button onClick={openDrawer} size="small" variant="contained">
        {dictionary.get('aggiungi')}
      </Button>
      <Drawer
        title={dictionary.get('aggiungiContatto')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <AnagraficaDrawer from='anagrafica'/>
      </Drawer>
    </>
  );
};