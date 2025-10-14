import * as React from 'react';
import { useState, useRef } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Box,
  Typography,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { randomId } from '@mui/x-data-grid-generator';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { isOverLength } from '@cmrc/ui/utils/validator-utils';
import LinearProgress from '@mui/material/LinearProgress';
import { Dialog } from '@cmrc/ui/components/Dialog';
import toast from '@cmrc/ui/components/Toast';
import { SezioneAllegatiTable } from './SezioneAllegatiTable';
import { dictionary } from './dictionary';
import { useGetTotalSizeFromBytes } from '../../../utils/sizing_utilities';
import InformativeDialog from '../../../components/InformativeDialog';
import {
  AllegatoUploadStatuses,
  AllegatoDownloadStatuses,
  AllegatoTimbroPosizione
} from '../../../utils/types';
import { MAX_NUMERO_UPLOAD_PARALLELI } from '../../../utils/const';
import { configurazioniFormProtocollo } from '../../../hooks/useConfigurazioniFormProtocollo';
import { useHTTPRequests } from '../../../utils/network_utilities';
import { EmailPreview } from './EmailPreview';
import { AllegatoTable, useAllegatiService } from './hooks/useAllegatiService';
import { useDialog } from '../../../store/dialog/useDialog';
import { useGetQueryExtensionList } from './hooks/useDataExtensionList';
import { useDownloadAllegati } from '../protocollo_actions/hooks/useDownloadAllegati';
import { useGetQueryDettaglioProtocollo } from '../useDataDettaglioProtocollo';
import { useDiscardAllegatoMutation } from '@cmrc/services/src/app/piapi/generated';
import { useGetAllegatiDiscardedListQuery } from '../hooks/useGetAllegatiDiscarded';
import { useGetQueryStoricoList } from '../storicizzazione/hooks/useDataStoricoList';

interface ProtocolloProps {
  uploadedFiles?: any;
  readMode?: boolean; // Make readMode optional with a question mark (?)
  canAddAllegati?: boolean;
  pecAction?: string;
  isTableAllegatiDirty?: boolean;
  blockUploadOnLimit?: boolean; // Se true, il componente non permette upload superiori al limite suggerito
  onChange?: any; // Callback che permette di registrare il componente per aggiornamenti sui file allegati
  onAllegatoDeleteRequest?: any; // Callback per la gestione dell'eliminazione di un allegato comunicando con il server
}

export const SezioneAllegati: React.FC<ProtocolloProps> = ({
  uploadedFiles = [],
  readMode = false,
  canAddAllegati = false,
  pecAction,
  isTableAllegatiDirty = false,
  blockUploadOnLimit = true,
  onChange = null,
  onAllegatoDeleteRequest = null
}) => {
  const [expanded, setExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [maxLengthFilenameMessage, setMaxLengthFilenameMessage] = useState('');
  const [tabellaIsDirty, setTabellaIsDirty] = useState(false);
  const [allegatoFooterMessage, setAllegatoFooterMessage] = useState('');
  const { showAllegatiFormError } = useAllegatiService();
  const { allegatiObbligatori, maxUploadSize, maxLengthFilenameAllegato } =
    configurazioniFormProtocollo();
  const { getRequest } = useHTTPRequests();
  const [email, setEmail] = useState();
  const [filenameEml, setFilenameEml] = useState('');
  const { data } = useGetQueryExtensionList();
  const { open, close, isOpen } = useDialog({
    dialog_id: 'dialogEmailPreview'
  });
  const { downloadAllegati } = useDownloadAllegati();
  const context = readMode ? useGetQueryDettaglioProtocollo() : null;
  const protocollo = readMode ? context?.currentData?.dettaglioProtocollo?.protocollo : null;
  const [discardAllegatoMutation] = useDiscardAllegatoMutation();
  const queryAllegatiDiscarded = useGetAllegatiDiscardedListQuery();
  const queryStorico = useGetQueryStoricoList();

  // NOTA: in questo metodo si decide quali file aggiungere alla coda di upload
  const updateUploadingFiles = (files: any) => {
    let numUploadingFiles = 0;
    for (let i = 0; i < files.length; i += 1) {
      if (
        files[i].uploadStatus === AllegatoUploadStatuses.UPLOADING ||
        files[i].uploadStatus === AllegatoUploadStatuses.IN_PROGRESS
      ) {
        numUploadingFiles += 1;
      }
    }

    const newUploadedFiles = [...files];
    for (let i = 0; i < newUploadedFiles.length; i += 1) {
      if (newUploadedFiles[i].uploadStatus === AllegatoUploadStatuses.QUEUED) {
        if (numUploadingFiles > MAX_NUMERO_UPLOAD_PARALLELI) {
          break;
        }
        numUploadingFiles += 1;
        newUploadedFiles[i].uploadStatus = AllegatoUploadStatuses.UPLOADING;
      }
    }
    if (onChange) onChange(newUploadedFiles);
  };

  const handleChangeAccordion = () => {
    setExpanded(!expanded);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFilesUploadedChosen = (files) => {
    setMaxLengthFilenameMessage('');
    const filesArray = Array.from(files);
    const maxLengthFilename = maxLengthFilenameAllegato;

    let totalSizeNew = 0;
    const validFilesArray = [];

    filesArray.map((fileInside: any) => {
      const file = fileInside;
      file.id = randomId();
      file.isMain = false;
      totalSizeNew += file.size;

      // Controlla se il file ha un nome più lungo di 150 caratteri
      const isInvalidFilename = isOverLength(file.name, maxLengthFilename);
      const extensionIndex = file.name.lastIndexOf('.');
      let fileExtension = '';
      if (extensionIndex !== -1)
        fileExtension = file.name.substring(extensionIndex);
      // ottengo l'estensione del file
      else {
        toast.error(
          dictionary.get('estensioneNonPresente', { filename: `${file?.name}` })
        );
        return; // Salta l'inserimento del file con estensione non presente
      }

      const isValidExtension = data?.getAllExtensions.find(
        (e) => e === fileExtension
      );

      if (!isValidExtension) {
        toast.error(
          dictionary.get('estensioneNonValida', { filename: `${file?.name}` })
        );
        return; // Salta l'inserimento del file non valido
      }

      if (isInvalidFilename) {
        const truncatedFilename =
          file.name.substring(0, maxLengthFilename - fileExtension.length) +
          fileExtension; // riduco il nome del file a 'maxLengthFilename' caratteri
        file.nome = truncatedFilename;
        setMaxLengthFilenameMessage(
          `Il file ${file.nome.substring(
            0,
            maxLengthFilename - fileExtension.length
          )}...${fileExtension} ${dictionary.get('maxLengthFilenameMessage', {
            max: `${maxLengthFilename}`
          })}`
        );
      } else {
        file.nome = file.name;
      }

      file.oggetto = file.name.replace(/\.[^/.]+$/, '');
      file.collocazioneTelematica = '';
      file.uploadStatus = AllegatoUploadStatuses.QUEUED;
      file.downloadStatus = AllegatoDownloadStatuses.READY;
      file.abortController = new AbortController();
      file.idAllegato = null;
      file.posizioneTimbro = AllegatoTimbroPosizione.TOP;
      file.estensione = fileExtension;
      file.dimensione = file.size;
      file.isAllegatoToAdd = true;

      // Aggiungi il file solo se è valido
      validFilesArray.push(file);
    });

    const filesArrayUnique = validFilesArray.filter((fileInArray: any) => {
      for (let i = 0; i < uploadedFiles.length; i++) {
        if (
          uploadedFiles[i].nome === fileInArray.nome &&
          uploadedFiles[i].estensione === fileInArray.estensione &&
          uploadedFiles[i].dimensione === fileInArray.dimensione
        ) {
          totalSizeNew -= fileInArray.dimensione;
          toast.warn(dictionary.get('fileDuplicato'));
          return false;
        }
      }
      return true;
    });

    let totalSizeOld = 0;
    for (let i = 0; i < uploadedFiles.length; i += 1) {
      totalSizeOld += uploadedFiles[i].dimensione;
    }

    if (blockUploadOnLimit && totalSizeNew + totalSizeOld > maxUploadSize) {
      setAllegatoFooterMessage(dictionary.get('maxUploadSizeExceeded'));
      return;
    }

    const filesArrayNew = [...uploadedFiles, ...filesArrayUnique];
    if (filesArrayNew.length > 0) {
      let isPrimarioSet = false;
      for (let i = 0; i < filesArrayNew.length; i += 1) {
        if (filesArrayNew[i].isMain) {
          isPrimarioSet = true;
          break;
        }
      }
      if (!isPrimarioSet) {
        filesArrayNew[0].isMain = true;
      }
    }
    setAllegatoFooterMessage('');
    updateUploadingFiles(filesArrayNew);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFilesUploadedChosen(event.dataTransfer.files);
  };
  const handleFileChange = (event) => {
    handleFilesUploadedChosen(event.target.files);
    fileInputRef.current.value = '';
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpdatesOnUploadedFiles = (
    file: AllegatoTable,
    deleteFile: boolean
  ) => {
    setMaxLengthFilenameMessage('');
    if (deleteFile) {
      // cancellazione riga
      // cancello la riga richiesta dall'array
      const updatedFiles = uploadedFiles.filter(
        (file_inside) => file_inside.id !== file.id
      );

      // se ho cancellato un file settato come primario e la lista contiene altri file...
      if (file.isMain && updatedFiles.length > 0) {
        // ... setto il primo file nella lista come primario
        updatedFiles[0].isMain = true;
      }
      return updatedFiles;
    }

    let isPrimarioSet = false;
    const updatedFiles = uploadedFiles.map((file_inside_to_update) => {
      const fileInside = file_inside_to_update;
      if (fileInside.id === file.id) {
        // aggiorno il file richiesto con i campi
        fileInside.isMain = file.isMain;
        fileInside.collocazioneTelematica = file.collocazioneTelematica;
        fileInside.oggetto = file.oggetto;
        fileInside.uploadStatus = file.uploadStatus;
        fileInside.downloadStatus = file.downloadStatus;
        fileInside.idAllegato = file.idAllegato;
        fileInside.posizioneTimbro = file.posizioneTimbro;
        fileInside.estensione = file.estensione;
      } else if (file.isMain) {
        // se il file da aggiornare è primario...
        // ... gli altri file sono settati come non primari
        fileInside.isMain = false;
      }

      if (fileInside.isMain) {
        isPrimarioSet = true;
      }

      return fileInside;
    });

    // se non esiste alcun file primario nella lista...
    if (updatedFiles.length > 0 && !isPrimarioSet) {
      // ... il primo file nella lista diventa primario
      updatedFiles[0].isMain = true;
    }

    return updatedFiles;
  };

  const handleDeleteFile = (file: AllegatoTable) => {
    const newUploadedFiles = handleUpdatesOnUploadedFiles(file, true);
    setTabellaIsDirty(true);
    setAllegatoFooterMessage('');
    if (onChange) onChange(newUploadedFiles);

    // se sto cancellando un file che ha un allegato sul server o che è in fase di upload...
    if (
      file.idAllegato !== null ||
      (file.uploadStatus === AllegatoUploadStatuses.UPLOADING &&
        onAllegatoDeleteRequest)
    ) {
      // ...devo effettuare ulteriori operazioni
      onAllegatoDeleteRequest(file);
    }
  };
  const handleDiscardFile = async (fileToDiscard) => {
    const idAllegato = fileToDiscard?.idAllegato;
    try {
      const response = await discardAllegatoMutation({
        idAllegato: idAllegato
      }).unwrap();
      if (response?.discardAllegato) {
        queryAllegatiDiscarded.refetch();
        queryStorico.refetch();
        toast.success(dictionary.get('allegatoCestinato'));
        const newUploadedFiles = handleUpdatesOnUploadedFiles(
          fileToDiscard,
          true
        );
        if (onChange) onChange(newUploadedFiles);
      }
    } catch (e) {
      toast.error(dictionary.get('allegatoNonCestinato'));
    }
  };

  const handleUpdatedFile = (file: AllegatoTable) => {
    const newUploadedFiles = handleUpdatesOnUploadedFiles(file, false);
    if (onChange) onChange(newUploadedFiles);
  };

  const handleRetryUploadFile = (file: AllegatoTable) => {
    const newUploadedFiles = [
      ...uploadedFiles.map((fileInside) => {
        if (file.id === fileInside.id) {
          fileInside.uploadStatus = AllegatoUploadStatuses.QUEUED;
        }
        return fileInside;
      })
    ];
    updateUploadingFiles(newUploadedFiles);
  };
  const handleDownloadFile = (file: AllegatoTable) => {
    const newUploadedFiles = [
      ...uploadedFiles.map((fileInside) => {
        if (file.id === fileInside.id) {
          fileInside.downloadStatus = AllegatoDownloadStatuses.DOWNLOADING;
        }
        return fileInside;
      })
    ];
    if (onChange) onChange(newUploadedFiles);
  };
  const handleDownloadOriginalClicked = (file: AllegatoTable) => {
    const newUploadedFiles = [
      ...uploadedFiles.map((fileInside) => {
        if (file.idOriginal === fileInside.idOriginal) {
          fileInside.downloadStatus = AllegatoDownloadStatuses.DOWNLOADING_ORIGINAL;
        }
        return fileInside;
      })
    ];
    if (onChange) onChange(newUploadedFiles);
  };

  const handlePosizioneTimbroClicked = (file: AllegatoTable) => {
    const newUploadedFiles = [
      ...uploadedFiles.map((fileInside) => {
        if (file.id === fileInside.id) {
          let nuovaPosizione: AllegatoTimbroPosizione =
            AllegatoTimbroPosizione.TOP;
          if (fileInside.posizioneTimbro === AllegatoTimbroPosizione.TOP)
            nuovaPosizione = AllegatoTimbroPosizione.BOTTOM;
          else if (
            fileInside.posizioneTimbro === AllegatoTimbroPosizione.BOTTOM
          )
            nuovaPosizione = AllegatoTimbroPosizione.LEFT;
          else if (fileInside.posizioneTimbro === AllegatoTimbroPosizione.LEFT)
            nuovaPosizione = AllegatoTimbroPosizione.RIGHT;
          fileInside.posizioneTimbro = nuovaPosizione;
        }
        return fileInside;
      })
    ];
    if (onChange) onChange(newUploadedFiles);
  };

  const handlePreviewEmlClicked = (file: AllegatoTable) => {
    setFilenameEml(file?.nome);
    // recupera l'email in formato byte[]
    if (file.idAllegato) {
      getRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/allegato/${file.idAllegato}`,
        (response) => {
          try {
            if (response?.data) {
              open();
              setEmail(response.data);
            } else {
              throw new Error(dictionary.get('responsePreviewKO'));
            }
          } catch (error) {
            toast.error(error.message);
            close();
          }
        }
      );
    }
  };

  let dialogMaxAllegato = null;
  if (allegatoFooterMessage !== '') {
    dialogMaxAllegato = (
      <Dialog
        fullWidth={false}
        open
        title={dictionary.get('avvisoMaxUploadSizeModal')}
        onClose={() => {
          setAllegatoFooterMessage('');
        }}
      >
        <InformativeDialog
          message={allegatoFooterMessage}
          cancelString={dictionary.get('chiudi')}
          onCancel={() => {
            setAllegatoFooterMessage('');
          }}
          sx={{ maxWidth: '500px' }}
        />
      </Dialog>
    );
  }

  // raccolgo i dati degli allegati
  let totalSize = 0; // la dimensione totale in byte
  for (let i = 0; i < uploadedFiles.length; i += 1) {
    totalSize += uploadedFiles[i].dimensione;
  }

  const totalSizeDisplay = useGetTotalSizeFromBytes(totalSize, 1); // dimensione da mostrare
  const maxTotalSizeDisplay = useGetTotalSizeFromBytes(maxUploadSize, 1); // TOTALE dimensione da mostrare
  const progress = (totalSize / maxUploadSize) * 100; // percentuale con cui popolare il componente "LinearProgress"
  const BorderLinearProgress = styled(LinearProgress)(({}) => ({
    // il primo parametro da passare alla funzione si chiama "theme", qualora dovesse essere utilizzato
    // height: 10,
    // borderRadius: 5
  }));

  return (
    <div>
      <Dialog title={filenameEml} open={isOpen} onClose={close}>
        <EmailPreview email={email} />
      </Dialog>
      <Accordion expanded={expanded} disableGutters>
        <AccordionSummary
          onClick={handleChangeAccordion}
          expandIcon={
            <UnfoldMoreIcon
              sx={{ marginLeft: '5px', color: expanded ? 'white' : 'grey' }}
            />
          }
          sx={{
            backgroundColor: expanded ? 'primary.main' : 'background.default',
            borderRadius: '8px',
            margin: '0',
            height: '55px'
          }}
        >
          <Box
            sx={{
              margin: '0',
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gridGap: '5px',
              alignItems: 'center',
              justifyItems: 'flex-end'
            }}
          >
            <Typography
              sx={{ color: expanded ? 'background.default' : 'primary.main' }}
            >
              {dictionary.get('allegati')}
              {allegatiObbligatori ? ' *' : ''}
            </Typography>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                downloadAllegati(protocollo);
              }}
              disabled={
                !protocollo ||
                !protocollo.nProtocollo ||
                protocollo?.nProtocollo?.length === 0
              }
              size="small"
              sx={{
                height: '30px',
                mr: 1,
                color: expanded ? 'background.default' : 'grey',
                '&:hover': {
                  backgroundColor: expanded && 'primary.dark'
                }
              }}
            >
              {dictionary.get('downloadAllegati')}
            </Button>
            <Box
              sx={{
                textAlign: 'right',
                paddingRight: '20px',
                color: expanded ? 'background.default' : 'grey',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              <Typography variant="caption">
                {uploadedFiles.length} {dictionary.get('numFiles')}
              </Typography>
              {blockUploadOnLimit ? (
                <Box
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '10px'
                  }}
                >
                  <BorderLinearProgress
                    sx={{ width: '128px' }}
                    variant="determinate"
                    color="secondary"
                    value={progress}
                  />
                  <Typography
                    variant="caption"
                    title={dictionary.get('dimensioneAllegatiTooltip')}
                  >
                    {totalSizeDisplay} / {maxTotalSizeDisplay}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    title={dictionary.get('dimensioneAllegatiTooltip')}
                  >
                    {totalSizeDisplay}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {!readMode || canAddAllegati ? (
            <Paper
              sx={{
                width: '100%',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #aaa',
                padding: 4
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <Typography variant="body1" color="textSecondary">
                {dictionary.get('Drag&DropMessage')}
              </Typography>
              <input
                accept={data?.getAllExtensions?.toString()}
                ref={fileInputRef}
                id="file-input"
                style={{ display: 'none' }}
                type="file"
                multiple
                disabled={readMode && !canAddAllegati}
                onChange={handleFileChange}
              />
            </Paper>
          ) : null}

          {maxLengthFilenameMessage && (
            <small style={{ color: 'red', fontWeight: 600, margin: '0px 3px' }}>
              {maxLengthFilenameMessage}
            </small>
          )}
          {dialogMaxAllegato}
          <SezioneAllegatiTable
            files={uploadedFiles}
            onDeleteFile={handleDeleteFile}
            onDiscardFile={handleDiscardFile}
            onUpdatedFile={handleUpdatedFile}
            onRetryUploadFile={handleRetryUploadFile}
            onDownloadClicked={handleDownloadFile}
            onDownloadOriginalClicked={handleDownloadOriginalClicked}
            onPosizioneTimbroClicked={handlePosizioneTimbroClicked}
            onPreviewEmlClicked={handlePreviewEmlClicked}
            readMode={readMode}
            pecAction={pecAction}
            canAddAllegati={canAddAllegati}
          />
        </AccordionDetails>
      </Accordion>
      {showAllegatiFormError(
        uploadedFiles.length,
        tabellaIsDirty || isTableAllegatiDirty
      ) ? (
        <Box sx={{ paddingTop: '15px' }}>
          <small style={{ fontWeight: '600', color: 'red' }}>
            {dictionary.get('allegatoNecessario')}
          </small>
        </Box>
      ) : null}
    </div>
  );
};
