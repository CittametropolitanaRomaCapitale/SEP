import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Titolario');

dictionary

  .add('titolario', 'Titolario')

  // Dialog
  .add('protocolli', 'Protocolli')
  .add('storico', 'Storico')
  .add('documenti', 'Documenti')
  .add('aggiungiTitolario', 'Aggiungi')
  .add('modificaTitolario', 'Modifica')

  // Buttons
  .add('aggiungi', 'Aggiungi')
  .add('aggiungiTitolo', 'Aggiungi titolo')
  .add('conferma', 'Conferma')
  .add('spostaFascicolo', 'Sposta fascicolo')
  .add('spostaProtocolli', 'Sposta protocolli')
  .add('spostaDocumenti', 'Sposta documenti')
  .add('annulla', 'Annulla')
  .add('elimina', 'Elimina')

  // Form
  .add('nome', 'Nome')
  .add('note', 'Note')
  .add('tsChiusura', 'Data di chiusura')
  .add('aggiungiNote', 'Aggiungi delle note')
  .add('checkBoxLabel', 'Può contenere protocolli')

  // Form info
  .add('tsAperturaFascicolo', 'Il fascicolo è stato aperto in data: ')
  .add('tsEliminazioneFascicolo', 'Il fascicolo è stato eliminato in data: ')

  // Titles
  .add('titolo', 'Titolo')
  .add('sezione', 'Sezione')
  .add('sottoSezione', 'SottoSezione')
  .add('fascicolo', 'Fascicolo')
  .add('confermaEliminazioneTitolario', 'Eliminazione')
  .add(
    'confermaEliminazioneDefinitivaFascicolo',
    'Sarà eliminato definitivamente anche tutto quello che esso contiene. Sei sicuro di voler continuare?'
  )
  .add(
    'confermaEliminazioneTitolarioMessage',
    'Sarà eliminato anche tutto quello che esso contiene. Sei sicuro di voler continuare?'
  )

  // Messages
  .add('saveSuccess', 'Salvataggio avvenuto con successo!')
  .add('updateSuccess', 'Titolario aggiornato con successo!')
  .add('fascicoliSpostati', 'Fascicoli spostati con successo!')
  .add('deleteSuccess', 'Elemento eliminato con successo')
  .add('dropSuccess', 'Elemento eliminato definitivamente con successo')
  .add('deleteNotSuccess', 'Eliminazione non avvenuta')
  .add('protocolliSpostati', 'I protocolli sono stati spostati con successo!')
  .add('documentiSpostati', 'I documenti sono stati spostati con successo!')
  .add('successoDownloadFascicolo', 'Fascicolo scaricato con successo')

  // Errors
  .add(
    'erroreSpostamentoFascicolo',
    'Errore durante lo spostamento del fascicolo'
  )
  .add(
    'erroreSpostamentoProtocolli',
    'Errore durante lo spostamento dei protocolli'
  )
  .add(
    'erroreSpostamentoDocumenti',
    'Errore durante lo spostamento dei documenti'
  )
  .add('erroreDownloadFascicolo', 'Errore durante il download del fascicolo')

  // Action
  .add('spostaFascicolo', 'Sposta fascicolo')
  .add('visualizzaStorico', 'Visualizza storico')
  .add('visualizzaProtocolli', 'Visualizza protocolli')
  .add('visualizzaDocumenti', 'Visualizza documenti')
  .add('eliminaFascicolo', 'Elimina fascicolo')
  .add('eliminaTitolo', 'Elimina titolo')
  .add('eliminaSezione', 'Elimina sezione')
  .add('eliminaSottoSezione', 'Elimina sottosezione')
  .add('gestisciVisibilita', 'Gestisci visibilità')
  .add('downloadFascicolo', 'Download fascicolo')
  .add('eliminaDefinitivamente', 'Elimina definitivamente')

  // Table
  .add('tabellaVuotaTesto', 'Nessun dato trovato')

  // FIlters
  .add('tipoRegistrazione', 'Tipo')

  // METODO DI SPEDIZIONE
  .add('metodoDiSpedizione', 'Metodo')
  .add('metodoDiSpedizioneAMano', 'A Mano')
  .add('metodoDiSpedizioneAccreditamentoWeb', 'Accreditamento WEB')
  .add('metodoDiSpedizioneCorriere', 'Corriere')
  .add('metodoDiSpedizioneEmail', 'Email')
  .add('metodoDiSpedizioneMepa', 'Mepa')
  .add('metodoDiSpedizioneNotificaAtti', 'Notifica Atti')
  .add('metodoDiSpedizionePec', 'Pec')
  .add('metodoDiSpedizioneSportello', 'Sportello')
  .add('metodoDiSpedizioneTracciabilita', 'Tracciabilit\u00E0')
  .add('metodoDiSpedizioneRaccomandata', 'Raccomandata A/R')
  .add('metodoDiSpedizioneRaccomandataSemplice', 'Raccomandata Semplice')
  .add('metodoDiSpedizionePostaPrioritaria', 'Posta Prioritaria')

  // FILTRO PROTOCOLLI
  .add('iMieiCompiti', 'I miei compiti')
  .add('ilMioUfficio', 'Il mio ufficio')

  // FILTRO NUMERO
  .add('nProtocollo', 'Numero')

  // FILTRO STATO PROTOCOLLO
  .add('inElaborazione', 'In elaborazione')

  // FILTRO TIPO PROTOCOLLO
  .add('entrata', 'Entrata')
  .add('uscita', 'Uscita')
  .add('interno', 'Interno')

  .add('stato', 'Stato')

  .add('cerca', 'Cerca');
