import { FCC } from '@cmrc/types/FCC';
import { Dispatch, SetStateAction } from 'react';
import { Grid } from '@mui/material';
import { TitolarioOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { EditTitolario } from './EditTitolario';
import { TitolarioActions } from './TitolarioActions';
import { useRicercaTitolario } from '../../../protocollo/protocollo_form/hooks/useRicercaTitolario';

export type TitolarioButtonsProps = {
  itemSelected: TitolarioOutputDto;
  breadcrumb?: TitolarioOutputDto[];
  disabled?: boolean;
  hasPermission?: boolean;
  hasAdminPermission?: boolean;
  isArchivista?: boolean;
  isImmutable?: boolean;
  setSelectedItem?: Dispatch<SetStateAction<TitolarioOutputDto>>;
  setSelectedItems?: Dispatch<SetStateAction<TitolarioOutputDto[]>>;
  onItemDeleted?: (item: any) => void;
  onItemUpdated?: (item: any) => void;
  setDisplayCheckbox?: (display: boolean) => void;
};

export const TitolarioButtons: FCC<TitolarioButtonsProps> = ({
  itemSelected,
  breadcrumb,
  disabled,
  hasPermission,
  hasAdminPermission,
  isArchivista,
  isImmutable,
  setSelectedItem,
  setSelectedItems,
  onItemDeleted,
  onItemUpdated,
  setDisplayCheckbox
}) => {
  const { isFascicoloLevel, isSezioneLevel } = useRicercaTitolario();
  const showActionMenu = isFascicoloLevel(breadcrumb);
  const isSezione = isSezioneLevel(breadcrumb);

  return (
    <Grid container justifyContent="end" display="flex" gap={1} width={1}>
      <EditTitolario
        hasPermission={hasPermission}
        itemSelected={itemSelected}
        breadcrumb={breadcrumb}
        disabled={disabled}
        hidden={itemSelected.fascicoloDipendente}
        onItemUpdated={onItemUpdated}
      />

      <TitolarioActions
        hasPermission={hasPermission}
        isImmutable={isImmutable}
        hasAdminPermission={hasAdminPermission}
        isArchivista={isArchivista}
        isSezione={isSezione}
        showSpostaMenu={showActionMenu}
        itemSelected={itemSelected}
        disabled={disabled}
        setSelectedItem={setSelectedItem}
        setSelectedItems={setSelectedItems}
        setDisplayCheckbox={setDisplayCheckbox}
        onItemDeleted={onItemDeleted}
      />
    </Grid>
  );
};
