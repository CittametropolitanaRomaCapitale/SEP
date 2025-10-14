import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CloudQueue from '@mui/icons-material/CloudQueue';
import CloudDone from '@mui/icons-material/CloudDone';
import CloudOff from '@mui/icons-material/CloudOff';
import BorderBottomIcon from '@mui/icons-material/BorderBottom';
import BorderTopIcon from '@mui/icons-material/BorderTop';
import BorderLeftIcon from '@mui/icons-material/BorderLeft';
import BorderRightIcon from '@mui/icons-material/BorderRight';
import CircularProgress from '@mui/material/CircularProgress';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId
} from '@mui/x-data-grid';

import { dictionary } from './dictionary';
import {
  AllegatoDownloadStatuses,
  AllegatoUploadStatuses,
  AllegatoTimbroPosizione
} from '../../../utils/types';
import { useRowUpdateHandler } from './hooks/useRowUpdateHandler';
import { usehandleStateChanger } from './hooks/usehandleStateChanger';
import { DiscardButton } from './buttons/DiscardButton';

export const SezioneAllegatiTable = ({
  files,
  onDeleteFile,
  onDiscardFile,
  onUpdatedFile,
  onRetryUploadFile,
  onDownloadClicked,
  onDownloadOriginalClicked,
  onPosizioneTimbroClicked,
  onPreviewEmlClicked,
  readMode,
  pecAction,
  canAddAllegati
}: any) => {
  const [rows, setRows] = useState(files);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    setRows(files);
  }, [files]);

  const handleDeleteClick = (id: GridRowId) => () => {
    const rowToDelete = rows.find((row) => row.id === id);
    if (rowToDelete) {
      onDeleteFile(rowToDelete);
    }
  };

  const handleRetryUploadClick = (id: GridRowId) => {
    const rowToReupload = rows.find((row) => row.id === id);
    if (rowToReupload) {
      onRetryUploadFile(rowToReupload);
    }
  };

  const handleDownloadClicked = (id: GridRowId) => {
    const rowToReupload = rows.find((row) => row.id === id);
    if (rowToReupload) {
      onDownloadClicked(rowToReupload);
    }
  };
  const handleDownloadOriginalClicked = (id: GridRowId) => {
    const rowToReupload = rows.find((row) => row.idOriginal === id);
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

  const handlePosizioneTimbroClicked = (id: GridRowId) => {
    const rowToReupload = rows.find((row) => row.id === id);
    if (rowToReupload) {
      onPosizioneTimbroClicked(rowToReupload);
    }
  };

  const handlePrimaryClicked = (id: GridRowId, isMain: boolean) => () => {
    const rowToUpdate = rows.find((row) => row.id === id);
    if (rowToUpdate) {
      const updatedRow = { ...rowToUpdate, isMain };
      onUpdatedFile(updatedRow);
    }
  };

  // Gestione processRowUpdate
  const { processRowUpdate } = useRowUpdateHandler(onUpdatedFile);

  // Gestione handleStateChange
  const { handleStateChange } = usehandleStateChanger(processRowUpdate);

  const columns: GridColDef[] = [
    {
      field: 'uploadStatus',
      width: 10,
      editable: false,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Tooltip
          title={dictionary.get('allegatoUploadStatusTooltip')}
          placement="top"
        >
          <UploadIcon />
        </Tooltip>
      ),
      renderCell: (e) => {
        if (
          e.value === AllegatoUploadStatuses.IN_PROGRESS ||
          e.value === AllegatoUploadStatuses.UPLOADING
        ) {
          return (
            <Box
              sx={{ display: 'flex' }}
              title={dictionary.get('allegatoUploadStatusUploading')}
            >
              <CircularProgress size={16} />
            </Box>
          );
        }
        if (e.value === AllegatoUploadStatuses.UPLOADED) {
          return (
            <CloudDone
              fontSize="small"
              color="success"
              titleAccess={dictionary.get('allegatoUploadStatusUploaded')}
            />
          );
        }
        if (e.value === AllegatoUploadStatuses.QUEUED) {
          return (
            <CloudQueue
              fontSize="small"
              color="action"
              titleAccess={dictionary.get('allegatoUploadStatusQueued')}
            />
          );
        }

        // NOTA: pulsante che viene mostrato in caso di errore e che permette di riprovare il caricamento
        return (
          <IconButton
            size="small"
            title={dictionary.get('allegatoUploadStatusError')}
            color="error"
            onClick={() => {
              handleRetryUploadClick(e.id);
            }}
          >
            <CloudOff fontSize="inherit" />
          </IconButton>
        );
      }
    },
    {
      field: 'isMain',
      type: 'actions',
      flex: 1,
      renderHeader: () => (
        <Tooltip
          title={dictionary.get('filePrincipaleTooltip')}
          placement="top"
        >
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('filePrincipale')}{' '}
            <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      ),
      cellClassName: 'actions',
      getActions: ({ id }) => {
        let isPrimary = false;
        const row = rows.find((r) => r.id === id);
        if (row) isPrimary = row.isMain;
        return [
          <GridActionsCellItem
            label=""
            icon={isPrimary ? <CheckIcon /> : <RadioButtonUncheckedIcon />}
            onClick={
              !readMode || canAddAllegati
                ? handlePrimaryClicked(id, !isPrimary)
                : null
            }
          />
        ];
      }
    },
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
      field: 'size',
      flex: 2,
      editable: false,
      hideSortIcons: true,
      sortable: false,
      renderHeader: (params) => (
        <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
          {dictionary.get('sizeFile')}
        </span>
      ),
      renderCell: (params) => {
        const size = Number(params.value);
        if (isNaN(size)) return '-';
        if (size >= 1_000_000) {
          const mb = Math.floor((size / 1_000_000) * 100) / 100;
          return `${mb.toFixed(2)} MB`;
        }
        const kb = Math.floor((size / 1000) * 100) / 100;
        return `${kb.toFixed(2)} KB`;
      }
    },
    {
      field: 'oggetto',
      flex: 2,
      editable: !readMode || canAddAllegati,
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
      editable: !readMode || canAddAllegati,
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
          if (readMode || pecAction) {
            if (
              e.row.downloadStatus === AllegatoDownloadStatuses.DOWNLOADING ||
              e.row.downloadStatus ===
                AllegatoDownloadStatuses.DOWNLOADING_ORIGINAL
            ) {
              downloadingStatus = (
                <Box
                  sx={{ display: 'flex' }}
                  title={dictionary.get('allegatoDownloadStatusDownloading')}
                >
                  <CircularProgress size={16} />
                </Box>
              );
            } else if (
              e.row.downloadStatus === AllegatoDownloadStatuses.ERROR
            ) {
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

              if (
                e.row.estensione.toLowerCase() === '.pdf' &&
                e.row.idOriginal
              ) {
                downloadOriginalButton = (
                  <IconButton
                    key={3}
                    size="small"
                    title={dictionary.get('downloadOriginalPdf')}
                    onClick={() => {
                      handleDownloadOriginalClicked(e.row.idOriginal);
                    }}
                  >
                    <PictureAsPdfIcon fontSize="inherit" />
                  </IconButton>
                );
              }
            }
          }

          // preview eml
          let previewEmlButton = null;
          if (
            (readMode || pecAction) &&
            e.row.estensione.toLowerCase() === '.eml'
          ) {
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

          // gestione timbro
          let borderButton = null;
          if (
            (!readMode || (canAddAllegati && e.row.isAllegatoToAdd)) &&
            e.row.estensione.toLowerCase() === '.pdf'
          ) {
            let borderIcon = <BorderTopIcon fontSize="inherit" />;
            let tooltipTimbroPosizione = dictionary.get(
              'allegatoPosizioneTimbroTopTooltip'
            );
            if (e.row.posizioneTimbro === AllegatoTimbroPosizione.BOTTOM) {
              borderIcon = <BorderBottomIcon fontSize="inherit" />;
              tooltipTimbroPosizione = dictionary.get(
                'allegatoPosizioneTimbroBottomTooltip'
              );
            } else if (e.row.posizioneTimbro === AllegatoTimbroPosizione.LEFT) {
              borderIcon = <BorderLeftIcon fontSize="inherit" />;
              tooltipTimbroPosizione = dictionary.get(
                'allegatoPosizioneTimbroLeftTooltip'
              );
            } else if (
              e.row.posizioneTimbro === AllegatoTimbroPosizione.RIGHT
            ) {
              borderIcon = <BorderRightIcon fontSize="inherit" />;
              tooltipTimbroPosizione = dictionary.get(
                'allegatoPosizioneTimbroRightTooltip'
              );
            }
            borderButton = (
              <IconButton
                key={1}
                color="primary"
                title={tooltipTimbroPosizione}
                onClick={() => {
                  handlePosizioneTimbroClicked(e.id);
                }}
              >
                {borderIcon}
              </IconButton>
            );
          }

          return [
            downloadingStatus,
            errorStatus,
            downloadButton,
            downloadOriginalButton,
            previewEmlButton,
            borderButton
          ];
        }
      }
    },
    {
      field: 'actions',
      type: 'actions',
      width: 10,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        if (!readMode || (canAddAllegati && row.isAllegatoToAdd))
          return [
            <GridActionsCellItem
              label=""
              icon={<DeleteIcon />}
              onClick={handleDeleteClick(id)}
            />
          ];
        if (
          row?.isMain !== true &&
          !row?.oggetto?.toLowerCase().includes('segnatura')
        )
          return [
            <DiscardButton
              allegatoData={row}
              icon={
                <IconButton title={dictionary.get('allegatoDiscardTooltip')}>
                  <FolderDeleteIcon
                    fontSize="small"
                    sx={(theme) => ({ color: theme.palette.neutral[500] })}
                  />
                </IconButton>
              }
              onDiscard={onDiscardFile}
            />
          ];
        return [];
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
        onStateChange={handleStateChange}
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
