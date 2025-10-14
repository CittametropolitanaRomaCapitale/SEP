import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Cestino');

dictionary
  // CESTINO
  .add('cestino', 'Cestino')
  .add(
    'Drag&DropMessage',
    'Trascina qui i tuoi file oppure fai click per selezionarli'
  )
  .add('nomeFile', 'Nome')
  .add('descrizione', 'Descrizione')
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
  .add('allegatoNecessario', "Il campo 'Allegati' è obbligatorio")
  .add('allegatoUploadStatusTooltip', "Stato di upload dell'allegato")
  .add('allegatoDownloadTooltip', 'Download file')
  .add('downloadOriginalPdf', 'Download PDF originale senza timbro di protocollo')
  .add('allegatoDownloadStatusDownloading', 'File in stato di download')
  .add(
    'allegatoDownloadStatusError',
    'Impossibile scaricare il file richiesto. Riprovare.'
  )
  .add('allegatoDownloadTooltip', 'Download file')
  .add('allegatoDownloadStatusDownloading', 'File in stato di download')
  .add(
    'allegatoDownloadStatusError',
    'Impossibile scaricare il file richiesto. Riprovare.'
  )
  .add('previewEml', 'Anteprima')
  .add(
    'responsePreviewKO',
    'Si è verificato un errore durante la preview della mail'
  )
  .add('allegatoResumeTooltip', 'Ripristina file')
  .add(
    'domandaRipristinoAllegato',
    "Sei sicuro di voler ripristinare l'allegato :nome?"
  )
  .add('resumeAllegato', 'Ripristina Allegato')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('allegatoNonRipristinato', 'Ripristino allegato non riuscito')
  .add('allegatoRipristinato', 'Allegato ripristinato')
  // Campi preview email
  .add('emailFrom', 'Da:')
  .add('emailTo', 'A:')
  .add('emailCc', 'Cc:')
  .add('emailAllegati', 'allegati');
