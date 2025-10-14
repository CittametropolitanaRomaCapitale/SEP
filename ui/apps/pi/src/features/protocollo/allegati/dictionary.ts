import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Allegati');

dictionary
  // ALLEGATI
  .add('allegati', 'Allegati')
  .add(
    'Drag&DropMessage',
    'Trascina qui i tuoi file oppure fai click per selezionarli'
  )
  .add('nomeFile', 'Nome')
  .add('sizeFile', 'Size')
  .add('descrizione', 'Descrizione')
  .add('filePrincipale', 'Principale')
  .add(
    'filePrincipaleTooltip',
    'Seleziona un allegato come documento principale. Di default, il primo file allegato sarà considerato come principale. Almeno un file deve essere scelto come principale.'
  )
  .add('collocazioneTelematica', 'Collocazione telematica')
  .add(
    'collocazioneTelematicaTooltip',
    'CIRCOLARE AGID N. 60 DEL 23 GENNAIO 2013'
  )
  .add(
    'linkCircolareN.60',
    'https://www.agid.gov.it/sites/default/files/repository_files/circolari/circolare_60_2013_segnatura_protocollo_informatico_-_rev_aipa_n.28-2001.pdf'
  )
  .add('textLinkCircolareN.60', 'Link alla circolare')
  .add('nessunAllegatoDisponibile', 'Nessun allegato caricato')
  .add(
    'maxLengthFilenameMessage',
    ' è stato rinominato in quanto supera i :max caratteri'
  )
  .add('numeroAllegati', 'Numero')
  .add('chiudi', 'Chiudi')
  .add('avvisoMaxUploadSizeModal', 'Avviso')
  .add('numFiles', 'file(s)')
  .add(
    'dimensioneAllegatiTooltip',
    'Tutti gli allegati non possono superare la dimensione massima stabilita'
  )
  .add(
    'maxUploadSizeExceeded',
    'Non è possibile allegare file la cui dimensione totale ecceda il limite stabilito'
  )
  .add('allegatoNecessario', "Il campo 'Allegati' è obbligatorio")
  .add('allegatoUploadStatusTooltip', "Stato di upload dell'allegato")
  .add('allegatoDownloadTooltip', 'Download file')
  .add('allegatoDownloadStatusDownloading', 'File in stato di download')
  .add(
    'allegatoDownloadStatusError',
    'Impossibile scaricare il file richiesto. Riprovare.'
  )
  .add('allegatoUploadStatusUploading', 'File in caricamento')
  .add('allegatoUploadStatusUploaded', 'File caricato correttamente')
  .add('allegatoUploadStatusQueued', 'File in attesa di essere caricato')
  .add(
    'allegatoUploadStatusError',
    'File non caricato correttamente. Clicca per riprovare a caricarlo'
  )
  .add(
    'allegatoPosizioneTimbroTopTooltip',
    'Clicca per cambiare la posizione del timbro in "SOTTO"'
  )
  .add(
    'allegatoPosizioneTimbroBottomTooltip',
    'Clicca per cambiare la posizione del timbro in "SINISTRA"'
  )
  .add(
    'allegatoPosizioneTimbroLeftTooltip',
    'Clicca per cambiare la posizione del timbro in "DESTRA"'
  )
  .add(
    'allegatoPosizioneTimbroRightTooltip',
    'Clicca per cambiare la posizione del timbro in "SOPRA"'
  )
  .add('allegatoNonEliminato', 'Eliminazione allegato non riuscita')
  .add('allegatoEliminato', 'Allegato eliminato')
  .add('previewEml', 'Anteprima')
  .add(
    'downloadOriginalPdf',
    'Download PDF originale senza timbro di protocollo'
  )
  .add(
    'responsePreviewKO',
    'Si è verificato un errore durante la preview della mail'
  )
  .add('datiEmailNonDisponibili', 'Informazioni non disponibili')
  .add(
    'estensioneNonPresente',
    "Impossibile caricare il file ':filename': estensione non presente"
  )
  .add(
    'estensioneNonValida',
    "Impossibile caricare il file ':filename': estensione non valida"
  )
  .add('downloadAllegati', 'Download Allegati')
  .add('allegatoDiscardTooltip', 'Sposta allegato nella sezione Cestino')
  .add('allegatoNonCestinato', 'Spostamento allegato nel cestino non riuscito')
  .add('allegatoCestinato', 'Allegato cestinato')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('discardAllegato', 'Cestina allegato')
  .add(
    'domandaCestinazioneAllegato',
    "Sei sicuro di voler cestinare l'allegato :nome?"
  )

  // Campi preview email
  .add('emailFrom', 'Da:')
  .add('emailTo', 'A:')
  .add('emailCc', 'Cc:')
  .add('emailAllegati', 'allegati')

  // Warning
  .add('fileDuplicato', 'Il file è già stato caricato');
