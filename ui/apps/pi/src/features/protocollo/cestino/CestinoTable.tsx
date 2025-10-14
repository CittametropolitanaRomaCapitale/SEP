import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CircularProgress from '@mui/material/CircularProgress';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridRowId
} from '@mui/x-data-grid';

import { dictionary } from './dictionary';
import { AllegatoDownloadStatuses } from '../../../utils/types';
import { ResumeButton } from './buttons/ResumeButton';

export const CestinoTable = ({
  files,
  onDownloadClicked,
  onDownloadOriginalClicked,
  onPreviewEmlClicked,
  onResumeFile
}: any) => {
  const [rows, setRows] = useState(files);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  useEffect(() => {
    setRows(files);
  }, [files]);

  const handleDownloadClicked = (id: GridRowId) => {
    const rowToReupload = rows.find((row) => row.id === id);
    if (rowToReupload) {
      onDownloadClicked(rowToReupload);
    }
  };
  const handleDownloadOriginalClicked = (id: GridRowId) => {
    const rowToReupload = rows.find(row => row.idOriginal === id);
    if (rowToReupload) {
      onDownloadOriginalClicked(rowToReupload);
    }
  };
  const handlePreviewClicked = (e) => {
    const rowToReupload = rows.find((row) => row.id === e.id);
    if (rowToReupload) {
      onPreviewEmlClicked(rowToReupload);
    }
  };
  const columns: GridColDef[] = [
    {
      field: 'nome',
      flex: 2,
      editable: false,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
          {dictionary.get('nomeFile')}
        </span>
      )
    },
    {
      field: 'oggetto',
      flex: 2,
      editable: false,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
          {dictionary.get('descrizione')}
        </span>
      )
    },
    {
      field: 'collocazioneTelematica',
      flex: 2,
      editable: false,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Tooltip
          title={
            <>
              {dictionary.get('collocazioneTelematicaTooltip')} -{' '}
              <a
                href={dictionary.get('linkCircolareN.60')}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'white' }}
              >
                {dictionary.get('textLinkCircolareN.60')}
              </a>
            </>
          }
          placement="top"
        >
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('collocazioneTelematica')}{' '}
            <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      )
    },
    {
      field: 'idAllegato',
      width: 65,
      editable: false,
      headerName: '',
      hideSortIcons: true,
      sortable: false,
      renderCell: (e) => {
        if (e.value !== null) {
          // download file
          let downloadingStatus = null;
          let errorStatus = null;
          let downloadButton = null;
          let downloadOriginalButton = null;
          if (e.row.downloadStatus === AllegatoDownloadStatuses.DOWNLOADING || e.row.downloadStatus === AllegatoDownloadStatuses.DOWNLOADING_ORIGINAL) {
            downloadingStatus = (
              <Box
                sx={{ display: 'flex' }}
                title={dictionary.get('allegatoDownloadStatusDownloading')}
              >
                <CircularProgress size={16} />
              </Box>
            );
          } else if (e.row.downloadStatus === AllegatoDownloadStatuses.ERROR) {
            // NOTA: pulsante che viene mostrato in caso di errore e che permette di riprovare il download
            errorStatus = (
              <IconButton
                size="small"
                title={dictionary.get('allegatoDownloadStatusError')}
                color="error"
                onClick={() => {
                  handleDownloadClicked(e.id);
                }}
              >
                <FileDownloadOffIcon fontSize="inherit" />
              </IconButton>
            );
          } else {
            downloadButton = (
              <IconButton
                key={2}
                size="small"
                title={dictionary.get('allegatoDownloadTooltip')}
                onClick={() => {
                  handleDownloadClicked(e.id);
                }}
              >
                <DownloadIcon fontSize="inherit" />
              </IconButton>
            );

            if (e.row.estensione.toLowerCase() === '.pdf' && e.row.idOriginal) {
              downloadOriginalButton = (
                <IconButton key={3} size='small' title={dictionary.get('downloadOriginalPdf')} onClick={() => { handleDownloadOriginalClicked(e.row.idOriginal); }}>
                  <PictureAsPdfIcon fontSize='inherit' />
                </IconButton >
              );
            }
          }

          // preview eml
          let previewEmlButton = null;
          if (e?.row?.estensione?.toLowerCase() === '.eml') {
            previewEmlButton = (
              <IconButton
                title={dictionary.get('previewEml')}
                onClick={() => {
                  handlePreviewClicked(e);
                }}
              >
                <OpenInBrowserIcon fontSize="small" />
              </IconButton>
            );
          }

          return [
            downloadingStatus,
            errorStatus,
            downloadButton,
            downloadOriginalButton,
            previewEmlButton
          ];
        }
      }
    },
    {
      field: 'actions',
      type: 'actions',
      width: 10,
      cellClassName: 'actions',
      getActions: ({ row }) => {
        return [
          <ResumeButton
            allegatoData={row}
            icon={
              <IconButton title={dictionary.get('allegatoResumeTooltip')}>
                <RestoreFromTrashIcon
                  fontSize="small"
                  sx={(theme) => ({ color: theme.palette.neutral[500] })}
                />
              </IconButton>
            }
            onResume={onResumeFile}
          />
        ];
      }
    }
  ];

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box
      sx={{
        width: { xs: 11 / 12, sm: 1 },
        minHeight: 'auto',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}
    >
      <DataGrid
        autoHeight
        localeText={{
          noRowsLabel: dictionary.get('nessunAllegatoDisponibile'),
          MuiTablePagination: {
            labelRowsPerPage: 'Elementi per pagina:'
          }
        }}
        sx={{
          marginTop: '20px',
          '--DataGrid-overlayHeight': '50px',
          '& .MuiDataGrid-cell:focus': { outline: 'none !important' },
          '& .MuiDataGrid-columnHeader:focus': { outline: 'none !important' }
        }}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        hideFooterSelectedRowCount
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } }
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        onProcessRowUpdateError={() => {}} // il parametro da passare è "error" qualora ce ne fosse il bisogno
      />
    </Box>
  );
};
