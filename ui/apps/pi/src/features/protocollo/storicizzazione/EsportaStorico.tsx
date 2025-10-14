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
  useExportStoricoMutation,
  RicercaStoricoDtoInput
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import * as dateUtils from '@cmrc/ui/utils/date-utils';
import { useTable } from '../../../store/table/useTable';
import { dictionary } from './dictionary';
import { buildAndDownloadFile } from '../../../utils/files_utilities';
import Tooltip from '@mui/material/Tooltip/Tooltip';

type EsportaStoricoProps = {
  idProtocollo: bigint;
  expanded?: boolean;
  cdrCode: string;
  isFilteredByCdr: boolean;
};

export const EsportaStorico: FCC<EsportaStoricoProps> = ({
  idProtocollo,
  expanded,
  cdrCode,
  isFilteredByCdr
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [exportStorico] = useExportStoricoMutation();
  const { tableData } = useTable({
    table_id: 'storicoProtocollo'
  });

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleExport = async (formato) => {
    if (formato === 'EXCEL') {
      setLoadingExcel(true);
    } else if (formato === 'PDF') {
      setLoadingPdf(true);
    }

    const dto: RicercaStoricoDtoInput = {
      page: tableData?.page || 0,
      size: 5,
      sort: tableData?.sort || undefined,
      cdr: undefined,
      idProtocollo: idProtocollo,
      cdrCode,
      isFilteredByCdr
    };

    try {
      const response = await exportStorico({
        dto,
        formato
      }).unwrap();
      if (response?.exportStorico) {
        const base64 = response?.exportStorico;
        const timestamp = dateUtils.formatQueryDateTime(
          new Date(),
          'dd-MM-yyyy_HH:mm:ss'
        );
        if (formato === 'EXCEL') {
          buildAndDownloadFile(
            base64,
            `Export_storico_${timestamp}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
        } else if (formato === 'PDF') {
          buildAndDownloadFile(
            base64,
            `Export_storico__${timestamp}.pdf`,
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
        onClick={handleClick}
        size="small"
        sx={{
          mr: 1,
          backgroundColor: expanded ? 'primary.main' : 'background.default',
          color: expanded ? 'white' : 'grey',
          '&:hover': {
            color: expanded ? 'background.default' : 'grey',
            backgroundColor: expanded ? 'primary.dark' : '#2677b70a'
          }
        }}
        variant={open ? 'outlined' : 'contained'}
      >
        <Tooltip title={dictionary.get('esportaStorico')} placement="top">
          <IosShareIcon fontSize="medium" />
        </Tooltip>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleExport('EXCEL');
          }}
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
          onClick={(e) => {
            e.stopPropagation();
            handleExport('PDF');
          }}
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
