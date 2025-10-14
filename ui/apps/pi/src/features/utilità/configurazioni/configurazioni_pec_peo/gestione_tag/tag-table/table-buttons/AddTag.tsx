import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { TagDrawer } from '../../tag/TagDrawer';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { dictionary } from '../../dictionary';

export const AddTag = () => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'tagDrawer'
  });

  return (
    <>
      <Button onClick={openDrawer} size="small" variant="contained">
        {dictionary.get('aggiungi')}
      </Button>

      <Drawer
        title={dictionary.get('aggiungiTag')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <TagDrawer />
      </Drawer>
    </>
  );
};
