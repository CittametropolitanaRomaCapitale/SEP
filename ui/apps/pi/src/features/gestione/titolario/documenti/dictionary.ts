import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Documenti titolario');

dictionary

  // Dialog
  .add('documenti', 'Documenti')
  .add('confermaEliminazioneDocumento', "Vuoi procedere con l'eliminazione del documento?")

  // Buttons
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('eliminaDocumento', 'Elimina documento')
  .add('scaricaDocumento', 'Scarica documento')
  .add('spostaDocumenti', 'Sposta documenti')
  .add('aggiungiDocumenti', 'Aggiungi documenti')

  // Messages
  .add('saveSuccess', 'Salvataggio avvenuto con successo!')
  .add('updateSuccess', 'Titolario aggiornato con successo!')
  .add('documentiSpostati', 'Documenti spostati con successo!')
  .add('uploadDocumentoOK', 'caricato con successo!')
  .add('deleteDocumentoOK', 'Documento eliminato con successo!')
  .add('downloadDocumentoOK', 'Documento scaricato con successo!')
  
  // Errors
  .add('uploadDocumentoKO', 'Errore durante il caricamento del documento')
  .add('deleteDocumentoKO', "Errore durante l'eliminazione del documento")
  .add('downloadDocumentoKO', 'Errore durante il download del documento')
  .add('erroreSpostamentoDocumenti', 'Errore durante lo spostamento dei documenti')

  // Table
  .add('cerca', 'Cerca documento')
  .add('nomeFile', 'Nome')
  .add('dimensione', 'Dimensione')
  .add('tabellaVuotaTesto', 'Nessun documento trovato')


