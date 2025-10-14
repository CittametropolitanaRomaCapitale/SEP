import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@cmrc/ui/components/Dialog';
import FullScreenDialog from '@cmrc/ui/components/FullScreenDialog';
import { TipologiaPosta } from '@cmrc/services/src/app/piapi/generated';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { dictionary } from '../dictionary';
import { useScaricaDocumentoPrincipale } from './hooks/useScaricaDocumentoPrincipale';
import { useExportStorico } from './hooks/useExportStorico';
import { useGeneraBarcode } from './hooks/useGeneraBarcode';
import { useGeneraRicevuta } from './hooks/useGeneraRicevuta';
import { useProtocolloActionsList } from './hooks/useProtocolloActionsList';
import { usePrendiInCarico } from './hooks/usePrendiInCarico';
import { useDialog } from '../../../store/dialog/useDialog';
import { AssegnaProtocollo } from './assegna_protocollo/AssegnaProtocollo';
import { NoteProtocollo } from './note_protocollo/NoteProtocollo';
import { RifiutaProtocollo } from './rifiuta_protocollo/RifiutaProtocollo';
import { AnnullaProtocollo } from './annulla_protocollo/AnnullaProtocollo';
import { GestisciAnnullamentoForm } from './gestisci_annullamento/GestisciAnnullamentoForm';
import { ClassificaProtocollo } from './classifica_protocollo/ClassificaProtocollo';
import { StoricoProtocolloLayout } from '../storicizzazione/layouts/StoricoProtocolloLayout';
import { InviaPecPeoForm } from './invia_pec_peo/InviaPecPeoForm';
import { useDownloadAllegati } from './hooks/useDownloadAllegati';
import { GetDataAllegatiProtocolloProvider } from '../hooks/useDataAllegatiProtocollo';
import { useRouter } from 'next/router';
import { FCC } from '@cmrc/types/FCC';
import { useOffice } from '@cmrc/auth/useOffice';

type ProtocolloActionsListProps = {
  requestStoricoUpdate?: () => void;
  from: string;
  protocolloData: any;
};

const ProtocolloActionsList: FCC<ProtocolloActionsListProps> = ({
  protocolloData,
  from,
  requestStoricoUpdate
}) => {
  const { cdr, cdrCode } = useOffice();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [subMenuAnchorElStorico, setSubMenuAnchorElStorico] =
    useState<null | HTMLElement>(null);
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});
  const [actionsList, setActionList] = useState([]);
  const [loadingDettaglio, setLoadingDettaglio] = useState(false);
  const [annullaDialogTitle, setAnnullaDialogTitle] = useState();
  const [selectedAction, setSelectedAction] = useState<string>();
  const [dettaglioProtocollo, setDettaglioProtocollo] = useState(null);
  const [tipologiaPosta, setTipologiaPosta] = useState('');
  const { scaricaDocumentoPrincipale } = useScaricaDocumentoPrincipale();
  const { exportStorico } = useExportStorico(protocolloData?.id);
  const { generaBarcode } = useGeneraBarcode();
  const { generaRicevuta } = useGeneraRicevuta();
  const { downloadAllegati } = useDownloadAllegati();
  const { prendiInCarico } = usePrendiInCarico();
  const { getActions, getDettaglio } = useProtocolloActionsList();
  const open = Boolean(anchorEl);
  const router = useRouter();

  const {
    open: openAssegnaDialog,
    isOpen: isOpenAssegna,
    close: closeAssegnaDialog
  } = useDialog({
    dialog_id: `dialogAssegnaProtocolloForm${protocolloData?.id}`
  });
  const {
    open: openNoteDialog,
    isOpen: isOpenNote,
    close: closeNoteDialog
  } = useDialog({
    dialog_id: `dialogNoteProtocollo${protocolloData?.id}`
  });

  const {
    open: openRifiutaDialog,
    isOpen: isOpenRifiuta,
    close: closeRifiutaDialog
  } = useDialog({
    dialog_id: `confermaRifiuta${protocolloData?.nProtocollo}`
  });

  const {
    open: openAnnullaDialog,
    isOpen: isOpenAnnulla,
    close: closeAnnullaDialog
  } = useDialog({
    dialog_id: `dialogAnnulla${protocolloData?.id}`
  });

  const {
    open: openClassificaDialog,
    isOpen: isOpenClassifica,
    close: closeClassificaDialog
  } = useDialog({
    dialog_id: `dialogClassificaProtocollo${protocolloData?.id}`
  });

  const {
    open: openStoricoDialog,
    isOpen: isOpenStorico,
    close: closeStoricoDialog
  } = useDialog({
    dialog_id: `dialogStorico${protocolloData?.id}`
  });
  const {
    open: openEmailFormDialog,
    isOpen: isOpenEmailForm,
    close: closeEmailFormDialog
  } = useDialog({
    dialog_id: `dialogEmaiForm${protocolloData?.id}`
  });

  const {
    open: openGestioneAnnullamentoDialog,
    isOpen: isOpenGestioneAnnullamento,
    close: closeGestioneAnnullamentoDialog
  } = useDialog({
    dialog_id: `dialogGestioneAnnullamento${protocolloData?.id}`
  });

  useEffect(() => {
    if (selectedAction) {
      setAnnullaDialogTitle(
        selectedAction === dictionary.get('annulla')
          ? dictionary.get('annullaTitle')
          : dictionary.get('richiestaAnnullamentoTitle')
      );
    }
  }, [selectedAction]);

  const getDettaglioProtocollo = useCallback(async () => {
    const response = await getDettaglio(protocolloData?.nProtocollo);
    return response?.dettaglioProtocollo;
  }, [protocolloData]);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setLoadingDettaglio(true);

      const dettaglio = await getDettaglioProtocollo();
      setDettaglioProtocollo(dettaglio);

      const actions = getActions(from, dettaglio);
      setActionList(actions);
      setLoadingDettaglio(false);
    },
    [getDettaglioProtocollo]
  );

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleClickAction = async (action: string) => {
    setLoadingActions((prev) => ({ ...prev, [action]: true }));
    setSelectedAction(action);
    try {
      switch (action) {
        case dictionary.get('generaBarcode'):
          await generaBarcode(
            protocolloData?.nProtocollo,
            from,
            requestStoricoUpdate
          );
          break;
        case dictionary.get('generaRicevuta'):
          await generaRicevuta(
            protocolloData?.nProtocollo,
            from,
            requestStoricoUpdate
          );
          break;
        case dictionary.get('downloadAllegati'):
          await downloadAllegati(protocolloData);
          break;
        case dictionary.get('scaricaDocumentoPrincipale'):
          await scaricaDocumentoPrincipale(protocolloData?.nProtocollo);
          break;
        case dictionary.get('prendiInCarico'):
          await prendiInCarico(protocolloData);
          break;
        case dictionary.get('assegna'):
          openAssegnaDialog();
          break;
        case dictionary.get('aggiungiNote'):
          openNoteDialog();
          break;
        case dictionary.get('rifiuta'):
          openRifiutaDialog();
          break;
        case dictionary.get('annulla'):
          openAnnullaDialog();
          break;
        case dictionary.get('richiestaAnnullamento'):
          openAnnullaDialog();
          break;
        case dictionary.get('gestRichiestaAnnullamento'):
          openGestioneAnnullamentoDialog();
          break;
        case dictionary.get('classifica'):
          openClassificaDialog();
          break;
        case dictionary.get('visualizzaStorico'):
          openStoricoDialog();
          break;
        case dictionary.get('exportStoricoExcel'):
          await exportStorico('EXCEL');
          break;
        case dictionary.get('exportStoricoPdf'):
          await exportStorico('PDF');
          break;
        case dictionary.get('inviaPEC'):
          openEmailFormDialog();
          setTipologiaPosta(TipologiaPosta.Pec);
          break;
        case dictionary.get('inviaPEO'):
          openEmailFormDialog();
          setTipologiaPosta(TipologiaPosta.Peo);
          break;
        case dictionary.get('clona'):
          router.push(`/crea-protocollo?from=${protocolloData?.nProtocollo}`);
          break;
        default:
          break;
      }
    } finally {
      setLoadingActions((prev) => ({ ...prev, [action]: false }));
      handleClose();
    }
  };

  return (
    <Box sx={{ textAlign: 'right' }}>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {loadingDettaglio ? (
          <MenuItem disabled>
            <CircularProgress size={16} />
          </MenuItem>
        ) : (
          actionsList.map((action) =>
            action === dictionary.get('inviaPecPeo') ? (
              <MenuItem
                key={action}
                onClick={() =>
                  setSubMenuAnchorEl((prev) =>
                    prev === action || subMenuAnchorEl ? null : action
                  )
                }
                sx={{ display: 'block', width: '100%' }}
              >
                <Stack direction="row">
                  <Typography variant="inherit">{action}</Typography>
                  {subMenuAnchorEl ? <ExpandLess /> : <ExpandMore />}
                </Stack>
                <Collapse
                  in={subMenuAnchorEl === action}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItemButton
                      onClick={() =>
                        handleClickAction(dictionary.get('inviaPEC'))
                      }
                      sx={{ pl: 4 }}
                    >
                      <Typography variant="inherit">
                        {dictionary.get('inviaPEC')}
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>
                        handleClickAction(dictionary.get('inviaPEO'))
                      }
                      sx={{ pl: 4 }}
                    >
                      <Typography variant="inherit">
                        {dictionary.get('inviaPEO')}
                      </Typography>
                    </ListItemButton>
                  </List>
                </Collapse>
              </MenuItem>
            ) : action === dictionary.get('exportStorico') ? (
              <MenuItem
                key={action}
                onClick={() =>
                  setSubMenuAnchorElStorico((prev) =>
                    prev === action || subMenuAnchorElStorico ? null : action
                  )
                }
                sx={{ display: 'block', width: '100%' }}
              >
                <Stack direction="row">
                  <Typography variant="inherit">{action}</Typography>
                  {subMenuAnchorElStorico ? <ExpandLess /> : <ExpandMore />}
                </Stack>
                <Collapse
                  in={subMenuAnchorElStorico === action}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItemButton
                      onClick={() =>
                        handleClickAction(dictionary.get('exportStoricoExcel'))
                      }
                      sx={{ pl: 4 }}
                    >
                      <Typography variant="inherit">
                        {dictionary.get('exportStoricoExcel')}
                      </Typography>
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>
                        handleClickAction(dictionary.get('exportStoricoPdf'))
                      }
                      sx={{ pl: 4 }}
                    >
                      <Typography variant="inherit">
                        {dictionary.get('exportStoricoPdf')}
                      </Typography>
                    </ListItemButton>
                  </List>
                </Collapse>
              </MenuItem>
            ) : (
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
                  <Typography variant="inherit">{action}</Typography>
                  {loadingActions[action] && (
                    <CircularProgress size={16} style={{ marginLeft: 10 }} />
                  )}
                </Box>
              </MenuItem>
            )
          )
        )}
      </Menu>
      <Dialog
        title={dictionary.get('assegna')}
        open={isOpenAssegna}
        onClose={closeAssegnaDialog}
      >
        <AssegnaProtocollo protocolloData={protocolloData} />
      </Dialog>
      <Dialog
        title={dictionary.get('note')}
        open={isOpenNote}
        onClose={closeNoteDialog}
      >
        <NoteProtocollo protocolloData={protocolloData} />
      </Dialog>
      <Dialog
        title={dictionary.get('rifiuta')}
        open={isOpenRifiuta}
        onClose={closeRifiutaDialog}
      >
        <RifiutaProtocollo nProtocollo={protocolloData?.nProtocollo} />
      </Dialog>
      <Dialog
        title={annullaDialogTitle}
        open={isOpenAnnulla}
        onClose={closeAnnullaDialog}
      >
        <AnnullaProtocollo
          action={selectedAction}
          protocolloData={protocolloData}
        />
      </Dialog>
      <FullScreenDialog
        title={dictionary.get('storico')}
        open={isOpenStorico}
        onClose={closeStoricoDialog}
        contrastBackground
      >
        <StoricoProtocolloLayout
          protocolloData={protocolloData}
          cdr={cdr}
          cdrCode={cdrCode}
        />
      </FullScreenDialog>
      <Dialog
        title={dictionary.get('gestRichiestaAnnullamento')}
        open={isOpenGestioneAnnullamento}
        onClose={closeGestioneAnnullamentoDialog}
      >
        <GestisciAnnullamentoForm protocolloData={protocolloData} />
      </Dialog>
      <Dialog
        title={dictionary.get('classifica')}
        open={isOpenClassifica}
        onClose={closeClassificaDialog}
      >
        <ClassificaProtocollo protocolloData={protocolloData} />
      </Dialog>
      <FullScreenDialog
        open={isOpenEmailForm}
        onClose={closeEmailFormDialog}
        title={dictionary.get(`invia${tipologiaPosta}`)}
      >
        <GetDataAllegatiProtocolloProvider idProtocollo={protocolloData?.id}>
          <InviaPecPeoForm
            dettaglioProtocollo={dettaglioProtocollo}
            tipologiaPosta={tipologiaPosta}
          />
        </GetDataAllegatiProtocolloProvider>
      </FullScreenDialog>
    </Box>
  );
};

export default ProtocolloActionsList;
