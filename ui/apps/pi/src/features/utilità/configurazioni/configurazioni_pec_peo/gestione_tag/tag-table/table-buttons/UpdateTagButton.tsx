import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { TagDrawer } from '../../tag/TagDrawer';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { dictionary } from '../../dictionary';
import { Tag } from '@cmrc/services/src/app/piapi/generated';

type UpdateTagButtonProps = {
  tagSelected: Tag;
};

export const UpdateTagButton: FCC<UpdateTagButtonProps> = ({ tagSelected }) => {
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawer({
    drawer_id: `tagDrawer_${tagSelected?.id}`
  });

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={openDrawer}
      >
        <EditIcon titleAccess={dictionary.get('modificaTag')} />
      </Button>

      <Drawer
        title={dictionary.get('modificaTag')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <TagDrawer tagSelected={tagSelected} />
      </Drawer>
    </>
  );
};
