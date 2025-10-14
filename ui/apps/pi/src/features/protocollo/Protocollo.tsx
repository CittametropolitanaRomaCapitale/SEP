import { useState, useEffect } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { useRouter } from 'next/router';
import { useOffice } from '@cmrc/auth/useOffice';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { PIService } from '@cmrc/services';
import {
  AllegatoInputInput,
  MittenteProtocolloInputInput,
  ModelloAutomaticoDto,
  ReferenteProtocolloInputInput,
  TipoRegistrazione
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useUploadFile } from '@cmrc/ui/utils/upload-utils';
import { useProtocolloForm } from './protocollo_form/hooks/useProtocolloForm';
import { SezioneAllegati } from './allegati/SezioneAllegati';
import ConfermaDatiNonSalvati from './conferma_dati_non_salvati/ConfermaDatiNonSalvati';
import { CreaProtocolloSkeletonForm } from '../../components/SkeletonLayouts/CreaProtocolloSkeletonForm';
import { useHTTPRequests } from '../../utils/network_utilities';
import {
  AllegatoUploadStatuses,
  AllegatoDownloadStatuses,
  AllegatoTimbroPosizione
} from '../../utils/types';
import { useAllegatiTableOperations } from './allegati/hooks/useAllegatiTableOperations';
import { useAllegatiService } from './allegati/hooks/useAllegatiService';
import { convertBooleanToInteger } from '../../utils/convertData_utilities';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useDialog } from '../../store/dialog/useDialog';
import { useBuildDatiDettaglioProtocollo } from './allegati/hooks/useBuildDatiDettaglioProtocollo';
import { ProtocolloForm } from './protocollo_form/hooks/useDestinatariProtocolloForm';
import { useGetQueryDettaglioProtocollo } from './useDataDettaglioProtocollo';
import { setInitialData } from '../../store/protocollo/protocolloSlice';
import {
  buildMittenteProtocollo,
  buildReferentiProtocollo,
  excludedParamUpdate,
  excludeParamSave
} from './hooks/useProtocollo';
import { GetDataExtensionListProvider } from './allegati/hooks/useDataExtensionList';
import { GetDataAllegatiDiscardedProvider } from './hooks/useGetAllegatiDiscarded';
import { dictionary } from './dictionary';
import ModelliSelectionLayout from './protocollo_form/ricerca_modelli/layouts/ModelliSelectionLayout';

export const Protocollo: FCC<{
  readMode;
  resumedAllegati?: any;
  hideAllegatiSection?: boolean;
}> = ({ readMode, resumedAllegati, hideAllegatiSection }) => {
  const { cdr, cdrCode } = useOffice();
  const router = useRouter();
  const { from } = router.query;
  const dispatch = useAppDispatch();
  const [route] = useState('/protocolli');
  const emailData = useAppSelector((state) => state.email.emailData);
  const pecAction = useAppSelector(
    (state) => state.email.inoltraRispondiConProtocollo
  );
  const { isLoading, data: dataDettaglio } = useGetQueryDettaglioProtocollo();
  const { initialData, initialAllegati } = useBuildDatiDettaglioProtocollo(
    readMode,
    emailData,
    pecAction,
    from && 'clona'
  );
  dispatch(setInitialData(initialData));

  const [firstRender, setFirstRender] = useState(true);

  const { methods, structure, isPecPeo, isRegistrazioneUscita } =
    useProtocolloForm(initialData, readMode, pecAction);
  const [allegati, setAllegati] = useState(initialAllegati);
  const [isSaving, setIsSaving] = useState(false);
  const [isTableAllegatiDirty, setIsTableAllegatiDirty] = useState(false);

  const [saveProtocolloMutation] = PIService.useSaveProtocolloMutation();
  const [updateProtocolloMutation] = PIService.useUpdateProtocolloMutation();
  const { uploadWithAbortSignal } = useUploadFile();
  const { downloadRequest } = useHTTPRequests();
  const { UseDeleteAllegato } = useAllegatiTableOperations();
  const { isAllegatiNecessari, areAllAllegatiLoaded } = useAllegatiService();

  const { open, close, isOpen } = useDialog({
    dialog_id: 'confirmUnsavedDialogTab'
  });

  useEffect(() => {
    if (resumedAllegati !== null && resumedAllegati?.id !== undefined) {
      let newResumedAllegato = { ...resumedAllegati };
      newResumedAllegato.isMain = false;
      newResumedAllegato.uploadStatus = AllegatoUploadStatuses.UPLOADED;
      newResumedAllegato.downloadStatus = AllegatoDownloadStatuses.READY;
      newResumedAllegato.abortController = new AbortController();
      newResumedAllegato.idAllegato = newResumedAllegato.id;
      newResumedAllegato.posizioneTimbro = AllegatoTimbroPosizione.TOP;
      newResumedAllegato.isAllegatoToAdd = false;
      const allegatiNew = [...allegati, ...[newResumedAllegato]];
      setAllegati(allegatiNew);
    }
  }, [resumedAllegati]);


  useEffect(() => {
    if (firstRender && from && initialData.tipoRegistrazione !== undefined) {
      setFirstRender(false);
      //console.log("initialData", initialData);
      methods.reset(initialData);
    }
  }, [initialData, firstRender]);

  const onSave = async ({ ...values }: ProtocolloForm) => {
    setIsSaving(true);
    const formData: ProtocolloForm = { ...values };

    /**
     * si blocca il salvataggio se la tabella non ha allegati, solo se gli allegati sono obbligatori
     *@param isAllegatiNecessari - è utilizzato per gestire messaggio di errore ('Il campo 'Allegati' è obbligatorio')
     */
    if (isAllegatiNecessari(allegati.length)) {
      setIsTableAllegatiDirty(true);
      setIsSaving(false);
      return;
    }

    // Se tuttti gli allegati non sono stati caricati blocco il salvataggio
    if (!areAllAllegatiLoaded(allegati)) {
      setIsTableAllegatiDirty(true);
      setIsSaving(false);
      return;
    }

    /**
     * Mappatura dei dati per il mittente necessari a garantire il salvataggio in anagrafica dei contatti ipa
     */
    const mittente: MittenteProtocolloInputInput = buildMittenteProtocollo(
      formData?.mittente
    );
    formData.mittente = mittente;

    /**
     * Se è stato selezionato un tag si salta la mappatura dei destinatari
     */

    if (!values.flagTag) {
      /**
       * Mappatura dei dati per i referenti per Competenza
       */
      const referenti: ReferenteProtocolloInputInput[] = [];
      Object.values(formData.destinatariCompetenza).forEach(
        (destinatario: any) => {
          const referente: ReferenteProtocolloInputInput =
            buildReferentiProtocollo(destinatario, 'competenza');
          referenti.push(referente);
        }
      );

      /**
       * Mappatura dei dati per i referenti per Competenza
       */
      Object.values(formData.destinatariConoscenza).forEach(
        (destinatario: any) => {
          const referente: ReferenteProtocolloInputInput =
            buildReferentiProtocollo(destinatario, 'conoscenza');

          if (referente.idAssegnatario) {
            referenti.push(referente);
          }
        }
      );

      formData.referenti = referenti;
    } else {
      formData.tagList = values.formTagList.map((item) => ({
        id: item.value?.id,
        nome: item.value.nome
      }));
    }

    formData.cdr = cdr;
    formData.cdrCode = cdrCode;
    formData.idTitolario = formData.idTitolario.map((item) => item.id);

    delete formData.destinatariCompetenza;
    delete formData.destinatariConoscenza;

    // svuoto i campi non necessari
    excludeParamSave.forEach((param) => delete formData[param]);

    // svuoto il campo invioMultiplo se la tipologia di registrazione non è Uscita e il metodo spedizione non è Email/Pec
    formData.invioEmailMultiplo =
      isRegistrazioneUscita && isPecPeo
        ? convertBooleanToInteger(values.invioEmailMultiplo)
        : 0;

    /**
     * si crea un oggetto allegati da inserire nell'oggetto formData
     * Se a questo punto non ci sono allegati significa che non sono obbligatori
     * @function forEach - non viene eseguita se lista allegati è vuota
     */
    formData.allegati = new Array<AllegatoInputInput>();
    allegati.forEach((allegato) => {
      const allegatoInput = {
        collocazioneTelematica: allegato.collocazioneTelematica,
        idAllegato: allegato.idAllegato,
        main: allegato.isMain,
        oggetto: allegato.oggetto,
        position:
          allegato.estensione.toLowerCase() === '.pdf'
            ? allegato.posizioneTimbro
            : null,
        estensione: allegato.estensione,
        nome: allegato.nome,
        dimensione: allegato.dimensione,
        inoltro: !!(
          pecAction === 'inoltraConProtocollo' && allegato.estensione === '.eml'
        )
      };
      formData.allegati.push(allegatoInput);
    });

    formData.dataProtocolloMittente =
      formData.dataProtocolloMittente === false
        ? null
        : formData.dataProtocolloMittente;
    formData.idUtente = null;
    formData.idUtenteLastOperation = null;
    
    //console.log(formData);
    //setIsSaving(false);
    //return;

    let response = null;
    try {
      response = await saveProtocolloMutation({ data: formData }).unwrap();
      if (response?.saveProtocollo?.id) {
        if (formData?.tipoRegistrazione === TipoRegistrazione.Circolare)
          toast.success(dictionary.get('circolareSalvata'));
        else toast.success(dictionary.get('protocolloSalvato'));
        router.push(`${route}/${response.saveProtocollo.nProtocollo}`);
      }
    } catch (error) {
      setIsSaving(false);
    }
    setIsSaving(false);
  };

  const onUpdate = async ({ ...values }: ProtocolloForm) => {
    setIsSaving(true);
    const formData = { ...values };

    // svuoto i campi non necessari
    excludedParamUpdate.forEach((param) => delete formData[param]);

    // Se tuttti gli allegati non sono stati caricati blocco il salvataggio
    if (!areAllAllegatiLoaded(allegati)) {
      setIsTableAllegatiDirty(true);
      setIsSaving(false);
      return;
    }

    /**
     * si crea un oggetto allegati da inserire nell'oggetto formData
     * Se a questo punto non ci sono allegati significa che non sono obbligatori
     * @function forEach - non viene eseguita se lista allegati è vuota
     */
    formData.allegati = new Array<AllegatoInputInput>();
    allegati.forEach((allegato) => {
      const allegatoInput = {
        collocazioneTelematica: allegato.collocazioneTelematica,
        idAllegato: allegato.idAllegato,
        main: allegato.isMain,
        oggetto: allegato.oggetto,
        position:
          allegato.estensione.toLowerCase() === '.pdf'
            ? allegato.posizioneTimbro
            : null,
        estensione: allegato.estensione,
        nome: allegato.nome,
        dimensione: allegato.dimensione,
        inoltro: !!(
          pecAction === 'inoltraConProtocollo' && allegato.estensione === '.eml'
        )
      };
      formData.allegati.push(allegatoInput);
    });

    formData.cdrCode = cdrCode;
    formData.nProtocollo = initialData.nProtocollo;
    formData.idTitolario = formData.idTitolario.map((item) => item.id);

    let response = null;
    try {
      response = await updateProtocolloMutation({ data: formData }).unwrap();
      if (response?.updateProtocollo?.id) {
        if (formData?.tipoRegistrazione === TipoRegistrazione.Circolare)
          toast.success(dictionary.get('circolareAggiornata'));
        else toast.success(dictionary.get('protocolloAggiornato'));
        router.reload();
      }
    } catch (error) {
      setIsSaving(false);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    open();
  };

  /**
   * NOTA: se l'utente sceglie di annullare l'invio, bisogna:
   * - eliminare tutti i file allegati
   * - interrompere quelli in corso di upload
   * */
  const handleConfirmDialog = () => {
    allegati.forEach((allegato: any) => UseDeleteAllegato(allegato.idAllegato));
    router.push(route);
  };

  const handleAllegatiChange = (fileAllegati) => {
    const newFileAllegati = fileAllegati.map((file) => {
      if (file.uploadStatus === AllegatoUploadStatuses.UPLOADING) {
        file.uploadStatus = AllegatoUploadStatuses.IN_PROGRESS;
      }
      return file;
    });
    setAllegati(newFileAllegati);
    newFileAllegati.forEach(async (file: any) => {
      if (
        file.downloadStatus === AllegatoDownloadStatuses.DOWNLOADING ||
        file.downloadStatus === AllegatoDownloadStatuses.DOWNLOADING_ORIGINAL
      ) {
        // Effettuo il download
        const downloadUrl =
          file.downloadStatus === AllegatoDownloadStatuses.DOWNLOADING
            ? `allegato/download/${file.idAllegato}`
            : `allegato/download/${file.idOriginal}`;
        downloadRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/${downloadUrl}`,
          filename: file.nome,
          forceDownload: true,
          callback: (data) => {
            let newDownloadStatus = AllegatoDownloadStatuses.ERROR;
            if (data.ok) {
              newDownloadStatus = AllegatoDownloadStatuses.READY;
            }
            const updatedAllegati = newFileAllegati.map((allegatoInside) => {
              if (allegatoInside.id === file.id) {
                allegatoInside.downloadStatus = newDownloadStatus;
              }
              return allegatoInside;
            });
            setAllegati(updatedAllegati);
          }
        });
      } else if (file.uploadStatus === AllegatoUploadStatuses.IN_PROGRESS) {
        const uploadUrl = 'allegato/carica';
        const formData = new FormData();
        formData.append('fileStream', file);
        formData.append('filename', file.nome);
        formData.append('collocazionetelematica', file.collocazioneTelematica);
        formData.append('oggetto', file.oggetto);
        formData.append('ismain', file.isMain ? '1' : '0');
        formData.append('size', file.dimensione);

        const timeout = setTimeout(() => {
          file.abortController.abort();
        }, 5 * 60 * 1000); // 5 minuti

        try {
          uploadWithAbortSignal(
            `${process.env.NEXT_PUBLIC_API_URL}/${uploadUrl}`,
            formData,
            file.abortController.signal,
            ({ data }) => {
              clearTimeout(timeout);
              let newUploadStatus = AllegatoUploadStatuses.ERROR;
              let idAllegato = null;
              if (data) {
                idAllegato = data?.data?.id;
                newUploadStatus = AllegatoUploadStatuses.UPLOADED;
              }

              const updatedAllegati = newFileAllegati.map((allegatoInside) => {
                if (allegatoInside.id === file.id) {
                  allegatoInside.uploadStatus = newUploadStatus;
                  allegatoInside.idAllegato = idAllegato;
                }
                return allegatoInside;
              });
              setAllegati(updatedAllegati);
            }
          );
        } catch (error) {
          clearTimeout(timeout);
          toast.error(`${dictionary.get('uploadDocumentoKO')} "${file?.nome}"`);
        }
      }
    });
  };

  const handleModelloProtocolloChange = (modello: ModelloAutomaticoDto) => {
    methods.setValue(
      'oggetto',
      modello.oggettoProtocollo == null ? '' : modello.oggettoProtocollo
    );
    methods.setValue('metodoSpedizione', modello.metodoSpedizione);
    methods.setValue('tipoRegistrazione', modello.tipoRegistrazione);
    methods.setValue(
      'idTitolario',
      modello.titolario !== null
        ? [
            {
              id: modello.titolario?.id,
              hierarchyString: modello.hierarchyStringTitolario,
              label: modello.titolario?.nome,
              key: modello.titolario?.id
            }
          ]
        : []
    );
  };

  return (
    <Card sx={{ marginBottom: '30px' }}>
      <Box>
        {isLoading ? (
          <Box>
            <CreaProtocolloSkeletonForm />
          </Box>
        ) : (
          <Grid
            container
            direction="column"
            rowSpacing={3}
            sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
            onSubmit={methods.handleSubmit(onSave)}
          >
            {!readMode && (
              <ModelliSelectionLayout
                onChangeModello={handleModelloProtocolloChange}
              />
            )}
            <Grid item>
              <FormGenerator
                disabled={readMode}
                methods={methods}
                structure={structure}
              />
            </Grid>
            <Grid item sx={{ width: { xs: 1 / 1, sm: 1 / 1 } }}>
              {
              !hideAllegatiSection &&
              <GetDataExtensionListProvider>
                <GetDataAllegatiDiscardedProvider
                  idProtocollo={
                    readMode ? dataDettaglio?.dettaglioProtocollo?.protocollo?.id : null
                  }
                >
                  <SezioneAllegati
                    uploadedFiles={allegati}
                    readMode={readMode}
                    canAddAllegati={initialData?.canUpdateProtocollo}
                    pecAction={pecAction}
                    blockUploadOnLimit={isRegistrazioneUscita && isPecPeo}
                    onChange={handleAllegatiChange}
                    onAllegatoDeleteRequest={UseDeleteAllegato}
                    isTableAllegatiDirty={isTableAllegatiDirty}
                  />
                </GetDataAllegatiDiscardedProvider>
              </GetDataExtensionListProvider>
              }
            </Grid>
            {!readMode && ( // Modalità creazione
              <Grid item>
                <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
                  <Button
                    onClick={handleCancel}
                    size="small"
                    disabled={isLoading || isSaving}
                    sx={{ height: '30px', mr: 1 }}
                  >
                    {dictionary.get('annulla')}
                  </Button>
                  <LoadingButton
                    onClick={methods.handleSubmit((values) => onSave(values))}
                    loading={isLoading || isSaving}
                    size="small"
                    variant="contained"
                    sx={{ height: '30px' }}
                  >
                    {dictionary.get('invia')}
                  </LoadingButton>
                </Grid>
              </Grid>
            )}
            {initialData?.canUpdateProtocollo && readMode &&
              !pecAction && ( // Pulsante invia solo se l'utente ha preso in carico
                <Grid item>
                  <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
                    <LoadingButton
                      onClick={methods.handleSubmit((values) =>
                        onUpdate(values)
                      )}
                      loading={isLoading || isSaving}
                      size="small"
                      variant="contained"
                      sx={{ height: '30px' }}
                    >
                      {dictionary.get('salva')}
                    </LoadingButton>
                  </Grid>
                </Grid>
              )}
          </Grid>
        )}
      </Box>
      <ConfermaDatiNonSalvati
        onConfirm={handleConfirmDialog}
        route={route}
        isOpen={isOpen}
        onCancel={() => close()}
      />
    </Card>
  );
};
