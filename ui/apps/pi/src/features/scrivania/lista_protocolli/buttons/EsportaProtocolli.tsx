import React, { useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IosShareIcon from '@mui/icons-material/IosShare';
import {
  useExportListaProtocolliMutation,
  RicercaProtocolliDtoInput,
  ProtocolloBaseFragment
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import * as dateUtils from '@cmrc/ui/utils/date-utils';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { useOffice } from '@cmrc/auth/useOffice';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import { buildAndDownloadFile } from '../../../../utils/files_utilities';

interface EsportaProtocolliProps {
  selectedProtocolli: ProtocolloBaseFragment[];
}

export const EsportaProtocolli: FCC<EsportaProtocolliProps> = ({
  selectedProtocolli
}) => {
  const { user } = useAuth();
  const { isUserPIAdmin } = useOffice();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [exportListaProtocolli] = useExportListaProtocolliMutation();

  const { tableData } = useTable({
    table_id: 'listaProtocolli'
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (formato) => {
    if (formato === 'EXCEL') {
      setLoadingExcel(true);
    } else if (formato === 'PDF') {
      setLoadingPdf(true);
    }

    const idProtocolliSelezionati = selectedProtocolli?.map(
      (protocollo) => protocollo.id
    );

    const dto: RicercaProtocolliDtoInput = {
      filtroUfficio: tableData?.filters?.filtro === 'IL_MIO_UFFICIO' || false,
      selectedOffice: user?.selectedOffice?.office?.code || undefined,
      search: tableData?.search || undefined,
      sort: tableData?.sort || undefined,
      cdr: tableData?.filters?.advancedFilters?.cdr || undefined,
      stato:
        tableData?.filters?.stato ||
        tableData?.filters?.advancedFilters?.advStato,
      numero:
        tableData?.filters?.nProtocollo ||
        tableData?.filters?.advancedFilters?.nProtocollo,
      oggetto:
        tableData?.filters?.oggetto ||
        tableData?.filters?.advancedFilters?.oggetto,
      dataCreazioneFrom:
        tableData?.filters?.dataCreazioneFrom ||
        tableData?.filters?.advancedFilters?.dataCreazioneFrom,
      dataCreazioneTo:
        tableData?.filters?.dataCreazioneTo ||
        tableData?.filters?.advancedFilters?.dataCreazioneTo,
      dataCreazioneEmergenzaFrom:
        tableData?.filters?.dataCreazioneEmergenzaFrom ||
        tableData?.filters?.advancedFilters?.dataCreazioneEmergenzaFrom,
      dataCreazioneEmergenzaTo:
        tableData?.filters?.dataCreazioneEmergenzaTo ||
        tableData?.filters?.advancedFilters?.dataCreazioneEmergenzaTo,
      mittente:
        tableData?.filters?.mittente ||
        tableData?.filters?.advancedFilters?.mittente,
      tipoRegistrazione:
        tableData?.filters?.tipoRegistrazione ||
        tableData?.filters?.advancedFilters?.advTipoRegistrazione,
      metodoSpedizione:
        tableData?.filters?.metodoSpedizione ||
        tableData?.filters?.advancedFilters?.advMetodoSpedizione,
      note: tableData?.filters?.advancedFilters?.note,
      assegnatari: tableData?.filters?.advancedFilters?.assegnatari,
      destinatari: tableData?.filters?.advancedFilters?.destinatari,
      ricercaAvanzata: tableData?.filters?.isRicercaAvanzata || false,
      filtroAll:
        (isUserPIAdmin && tableData?.filters?.filtro === 'ALL') || false,
      tagList: tableData?.filters?.advancedFilters?.tagList,
      nomeTitolario: tableData?.filters?.advancedFilters?.classificazione,
      idFascicoli: tableData?.filters?.advancedFilters?.idTitolario?.map(
        (fascicolo) => fascicolo.id
      )
    };

    try {
      const response = await exportListaProtocolli({
        dto,
        formato,
        idProtocolliSelezionati
      }).unwrap();

      if (response?.exportListaProtocolli) {
        const base64 = response?.exportListaProtocolli;
        const timestamp = dateUtils.formatQueryDateTime(
          new Date(),
          'dd-MM-yyyy_HH:mm:ss'
        );
        if (formato === 'EXCEL') {
          buildAndDownloadFile(
            base64,
            `Export_protocolli_${timestamp}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
        } else if (formato === 'PDF') {
          buildAndDownloadFile(
            base64,
            `Export_protocolli_${timestamp}.pdf`,
            'application/pdf'
          );
        }
        toast.success(dictionary.get('exportOK'));
      }
    } catch (error) {
      toast.error(dictionary.get('exportError'));
    } finally {
      if (formato === 'EXCEL') {
        setLoadingExcel(false);
      } else if (formato === 'PDF') {
        setLoadingPdf(false);
      }
    }
  };

  return (
    <>
      <Button
        startIcon={<IosShareIcon fontSize="medium" />}
        onClick={handleClick}
        size="small"
        sx={{ mr: 1 }}
        variant={open ? 'outlined' : 'contained'}
      >
        {dictionary.get('esportaProtocolli')}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => handleExport('EXCEL')}
          disabled={loadingExcel}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Typography variant="inherit">
              {' '}
              {dictionary.get('exportAsExcel')}
            </Typography>
            {loadingExcel && (
              <CircularProgress size={16} style={{ marginLeft: 10 }} />
            )}
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => handleExport('PDF')}
          disabled={loadingPdf}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Typography variant="inherit">
              {' '}
              {dictionary.get('exportAsPDF')}
            </Typography>
            {loadingPdf && (
              <CircularProgress size={16} style={{ marginLeft: 10 }} />
            )}
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};
