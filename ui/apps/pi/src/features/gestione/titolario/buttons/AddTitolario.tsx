import { FCC } from '@cmrc/types/FCC';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import AddIcon from '@mui/icons-material/Add';
import { TitolarioOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { TitolarioFormDrawer } from '../forms/TitolarioFormDrawer';
import { useTitolarioButtons } from './hooks/useTitolarioButtons';
import { dictionary } from '../dictionary';

export type AddTitolarioProps = {
  disabled?: boolean;
  hasPermission?: boolean;
  breadcrumb: TitolarioOutputDto[];
  onItemUpdated?: (item: any) => void;
};

export const AddTitolario: FCC<AddTitolarioProps> = ({
  hasPermission,
  breadcrumb,
  disabled,
  onItemUpdated
}) => {
  const { addTitolarioSetionTitle } = useTitolarioButtons();
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'titolarioDrawer'
  });

  const title = addTitolarioSetionTitle(breadcrumb);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={openDrawer}
          disabled={disabled}
          size="small"
          variant="text"
          startIcon={<AddIcon />}
        >
          {`${dictionary.get('aggiungi')} ${title}`}
        </Button>
      </Box>
      <Drawer
        title={`${dictionary.get('aggiungiTitolario')} ${title}`}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <TitolarioFormDrawer
          hasPermission={hasPermission}
          breadcrumb={breadcrumb}
          onItemUpdated={onItemUpdated}
        />
      </Drawer>
    </>
  );
};
