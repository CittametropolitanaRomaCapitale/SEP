import { FCC } from '@cmrc/types/FCC';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@cmrc/ui/components/Drawer';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { TitolarioOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { TitolarioFormDrawer } from '../forms/TitolarioFormDrawer';
import { dictionary } from '../dictionary';
import { useTitolarioButtons } from './hooks/useTitolarioButtons';

export type EditTitolarioProps = {
  itemSelected: TitolarioOutputDto;
  breadcrumb?: TitolarioOutputDto[];
  disabled?: boolean;
  hidden?: boolean;
  hasPermission?: boolean;
  onItemUpdated?: (item: any) => void;
};

export const EditTitolario: FCC<EditTitolarioProps> = ({
  hasPermission,
  itemSelected,
  breadcrumb,
  disabled,
  hidden,
  onItemUpdated
}) => {
  const { editTitolarioSetionTitle } = useTitolarioButtons();
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: `titolarioDrawer_${itemSelected?.id}`
  });

  const section = editTitolarioSetionTitle(itemSelected);
  const title = hasPermission
    ? `${dictionary.get('modificaTitolario')} ${section}`
    : `${section}`;

  return (
    !hidden && (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={openDrawer}
            edge="end"
            aria-label="modifica"
            disabled={disabled}
          >
            {hasPermission && !itemSelected.deleted ? (
              <EditIcon
                color={disabled ? 'inherit' : 'primary'}
                titleAccess={`Modifica ${itemSelected?.tipologia}`}
              />
            ) : (
              <DescriptionIcon
                color="primary"
                titleAccess={`Visualizza ${itemSelected?.tipologia}`}
              />
            )}
          </IconButton>
        </Box>
        <Drawer title={title} onClose={closeDrawer} open={isOpenDrawer}>
          <TitolarioFormDrawer
            hasPermission={hasPermission && !itemSelected.deleted}
            itemSelected={itemSelected}
            breadcrumb={breadcrumb}
            onItemUpdated={onItemUpdated}
          />
        </Drawer>
      </>
    )
  );
};
