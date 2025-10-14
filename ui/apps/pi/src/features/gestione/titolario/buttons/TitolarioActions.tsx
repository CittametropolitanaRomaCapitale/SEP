import { Dispatch, SetStateAction, useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
  TipologiaTitolario,
  TitolarioOutputDto
} from '@cmrc/services/src/app/piapi/generated';
import Box from '@mui/material/Box';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@cmrc/ui/components/Dialog';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FullScreenDialog from '@cmrc/ui/components/FullScreenDialog';
import { useDispatch } from 'react-redux';
import { useDialog } from '../../../../store/dialog/useDialog';
import { LayoutSpostaProtocolli } from '../sposta_protocolli/layouts/LayoutSpostaProtocolli';
import { TitolarioConfermaEliminazioneForm } from '../forms/TitolarioConfermaEliminazioneForm';
import { TitolarioConfermaEliminazioneDefinitivaForm } from '../forms/TitolarioConfermaEliminazioneDefinitivaForm';
import { dictionary } from '../dictionary';
import { useSnackbar } from '../../../../store/snackbar/useSnackBar';
import { LayoutStoricoTitolario } from '../layouts/LayoutStoricoTitolario';
import { useGestisciVisibilita } from './hooks/useGestisciVisibilita';
import { LayoutDocumentiFascicolo } from '../documenti/layouts/LayoutDocumentiFascicolo';
import { setInitialData } from '../../../../store/titolario/titolarioSlice';
import { useDownloadFascicolo } from './hooks/useDownloadFascicolo';

export type TitolarioActionsProps = {
  hasPermission?: boolean;
  hasAdminPermission?: boolean;
  isArchivista?: boolean;
  isImmutable?: boolean;
  isSezione?: boolean;
  itemSelected: TitolarioOutputDto;
  showSpostaMenu: boolean;
  disabled?: boolean;
  setSelectedItem?: Dispatch<SetStateAction<TitolarioOutputDto>>;
  setSelectedItems?: Dispatch<SetStateAction<TitolarioOutputDto[]>>;
  onItemDeleted?: (item: any) => void;
  setDisplayCheckbox?: (display: boolean) => void;
};

export const TitolarioActions: FCC<TitolarioActionsProps> = ({
  hasPermission,
  hasAdminPermission,
  isArchivista,
  isImmutable,
  isSezione,
  itemSelected,
  showSpostaMenu,
  disabled,
  setSelectedItem,
  setSelectedItems,
  onItemDeleted,
  setDisplayCheckbox
}) => {
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});
  const { gestisciVisibilita } = useGestisciVisibilita();
  const { downloadFascicolo } = useDownloadFascicolo();
  const dispatch = useDispatch();
  const actionsList = [];

  if (itemSelected?.tipologia?.toLowerCase().includes('fascicolo')) {
    actionsList.push(dictionary.get('downloadFascicolo'));
  }

  if (!itemSelected.deleted) {
    actionsList.push(dictionary.get('visualizzaStorico'));

    if (
      showSpostaMenu &&
      hasPermission &&
      !isSezione &&
      !itemSelected?.fascicoloDipendente
    ) {
      actionsList.push(dictionary.get('spostaFascicolo'));
    }

    // archivista o admin
    if (!isSezione) {
      if (itemSelected?.leaf) {
        actionsList.push(dictionary.get('visualizzaProtocolli'));
        actionsList.push(dictionary.get('visualizzaDocumenti'));
      }

      if (hasPermission && !itemSelected?.fascicoloDipendente) {
        if (itemSelected?.tipologia === TipologiaTitolario.FascicoloLv1)
          actionsList.push(dictionary.get('gestisciVisibilita'));

        actionsList.push(dictionary.get('eliminaFascicolo'));
      }
    }

    // admin e solo sezioni di primo, secondo e terzo livello
    if (hasAdminPermission && isSezione && !itemSelected?.fascicoloDipendente) {
      actionsList.push(dictionary.get(`elimina${itemSelected?.tipologia}`));
    }
  } else {
    actionsList.push(dictionary.get('visualizzaStorico'));
  }
  if (isArchivista && hasAdminPermission && itemSelected?.deleted) {
    actionsList.push(dictionary.get('eliminaDefinitivamente'));
  }

  /*
  if (showSpostaMenu) {
    if (hasPermission && !itemSelected.deleted) {
      actionsList = [
        dictionary.get('spostaFascicolo'),
        dictionary.get('visualizzaStorico'),
        dictionary.get('visualizzaProtocolli'),
        dictionary.get('gestisciVisibilita'),
        dictionary.get('eliminaFascicolo')
      ];
    }
  }
  */

  const {
    open: openSpostaProtocolliDialog,
    isOpen: isOpenSpostaProtocolli,
    close: closeSpostaProtocolliDialog
  } = useDialog({
    dialog_id: `dialogVisualizzaProtocolli${itemSelected?.id}`
  });

  const {
    open: openViewStoricoTitolarioDialog,
    isOpen: isOpenVisualizzaStoricoTitolario,
    close: closeViewStoricoTitolarioDialog
  } = useDialog({
    dialog_id: `dialogViewStoricoTitolario${itemSelected?.id}`
  });

  const {
    open: openEliminaFascicoloDialog,
    isOpen: isOpenEliminaFascicolo,
    close: closeEliminaFascicoloDialog
  } = useDialog({
    dialog_id: `dialogEliminaTitolario${itemSelected?.id}`
  });

  const {
    open: openEliminaDefinitivamenteFascicoloDialog,
    isOpen: isOpenEliminaDefinitivamenteFascicolo,
    close: closeEliminaDefinitivamenteFascicoloDialog
  } = useDialog({
    dialog_id: `dialogEliminaDefinitivamenteFascicolo${itemSelected?.id}`
  });

  const {
    open: openDocumentiFascicoloDialog,
    isOpen: isOpenDocumentiFascicolo,
    close: closeDocumentiFascicoloDialog
  } = useDialog({
    dialog_id: `dialogVisualizzaDocumenti${itemSelected?.id}`
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAction = (action: string) => {
    switch (action) {
      case dictionary.get('visualizzaProtocolli'):
        setSelectedItem(itemSelected);
        // L'id padre viene messo nello state per essere ripreso nel componente 'ListaProtocolliFascicolo'
        dispatch(setInitialData(itemSelected));
        openSpostaProtocolliDialog();
        break;
      case dictionary.get('visualizzaDocumenti'):
        setSelectedItem(itemSelected);
        openDocumentiFascicoloDialog();
        break;
      case dictionary.get('spostaFascicolo'):
        setSelectedItems([itemSelected]);
        setDisplayCheckbox(true);
        break;
      case dictionary.get('visualizzaStorico'):
        setSelectedItem(itemSelected);
        openViewStoricoTitolarioDialog();
        break;
      case dictionary.get('gestisciVisibilita'):
        gestisciVisibilita(itemSelected);
        break;
      case dictionary.get('downloadFascicolo'):
        downloadFascicolo(itemSelected);
        break;
      case dictionary.get('eliminaFascicolo'):
      case dictionary.get('eliminaTitolo'):
      case dictionary.get('eliminaSezione'):
      case dictionary.get('eliminaSottoSezione'):
        openEliminaFascicoloDialog();
        break;
      case dictionary.get('eliminaDefinitivamente'):
        openEliminaDefinitivamenteFascicoloDialog();
        break;
      default:
        break;
    }
    setAnchorEl(null);
  };

  const handleClickAction = (action: string) => {
    setLoadingActions((prev) => ({ ...prev, [action]: true }));
    handleAction(action);
    setLoadingActions((prev) => ({ ...prev, [action]: false }));
  };

  const onOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const isEliminaAction = (action) => {
    if (
      action === dictionary.get('eliminaFascicolo') ||
      action === dictionary.get('eliminaTitolo') ||
      action === dictionary.get('eliminaSezione') ||
      action === dictionary.get('eliminaSottoSezione') ||
      action === dictionary.get('eliminaDefinitivamente')
    )
      return true;

    return false;
  };

  return (
    <>
      <Box sx={{ textAlign: 'right' }}>
        <IconButton onClick={(event) => onOpen(event)} disabled={disabled}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={onClose}
        >
          {actionsList.map((action) => {
            return (
              <MenuItem
                key={action}
                onClick={() => handleClickAction(action)}
                disabled={loadingActions[action]}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <Typography
                    variant="inherit"
                    color={isEliminaAction(action) ? 'error' : ''}
                  >
                    {action}
                  </Typography>
                  {loadingActions[action] && (
                    <CircularProgress size={16} style={{ marginLeft: 10 }} />
                  )}
                </Box>
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      <FullScreenDialog
        fullWidth
        title={`${dictionary.get('protocolli')} - ${itemSelected?.label}`}
        open={isOpenSpostaProtocolli}
        onClose={closeSpostaProtocolliDialog}
        contrastBackground
      >
        <LayoutSpostaProtocolli itemSelected={itemSelected} />
      </FullScreenDialog>
      <FullScreenDialog
        fullWidth
        title={`${dictionary.get('documenti')} - ${itemSelected?.label}`}
        open={isOpenDocumentiFascicolo}
        onClose={closeDocumentiFascicoloDialog}
        contrastBackground
      >
        <LayoutDocumentiFascicolo
          itemSelected={itemSelected}
          hasPermission={hasPermission}
        />
      </FullScreenDialog>
      <FullScreenDialog
        title={`${dictionary.get('storico')} - ${itemSelected?.label}`}
        open={isOpenVisualizzaStoricoTitolario}
        onClose={closeViewStoricoTitolarioDialog}
        contrastBackground
      >
        <LayoutStoricoTitolario itemSelected={itemSelected} />
      </FullScreenDialog>
      <Dialog
        fullWidth={false}
        title={`${dictionary.get(
          'confermaEliminazioneTitolario'
        )} ${itemSelected?.tipologia.toLowerCase()} "${itemSelected?.label}"`}
        open={isOpenEliminaFascicolo}
        onClose={closeEliminaFascicoloDialog}
      >
        <TitolarioConfermaEliminazioneForm
          titolario={itemSelected}
          onItemDeleted={onItemDeleted}
        />
      </Dialog>
      <Dialog
        fullWidth={false}
        title={`${dictionary.get(
          'confermaEliminazioneTitolario'
        )} ${itemSelected?.tipologia.toLowerCase()} "${itemSelected?.label}"`}
        open={isOpenEliminaDefinitivamenteFascicolo}
        onClose={closeEliminaDefinitivamenteFascicoloDialog}
      >
        <TitolarioConfermaEliminazioneDefinitivaForm
          titolario={itemSelected}
          onItemDropped={onItemDeleted}
        />
      </Dialog>
    </>
  );
};
