import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ListaEmail');

dictionary
  // PULSANTI TOPBAR
  // TODO:

  // FILTRO
  .add('statoClassificazione', 'Classificazione')
  .add('statoAssegnazione', 'Assegnazione')
  .add('statoLavorazione', 'Lavorate')
  .add('cercaMail', 'Cerca qui le tue Email')
  .add('indirizzoPEC', 'PEC')

  // CAMPI
  .add('from', 'mittente')
  .add('to', 'destinatario')
  .add('tipoEmail', 'Tipo')
  .add('oggetto', 'oggetto')
  .add('nProtocollo', 'protocollo')
  .add('emailDirection', 'direzione')
  .add('tsInvio', 'data invio')
  .add('tsRicezione', 'data ricezione')
  .add('classificazione', 'Classificato')
  .add('assegnazione', 'Assegnato')
  .add('statoInvio', 'Stato invio')

  // VARIE
  .add('tabellaVuotaTesto', 'Non ci sono email')
  .add('tabellaInCaricamento', 'Caricamento dati...')
  .add('noMailAvailable', 'Nessun indirizzo di posta selezionato')

  // DETTAGLIO EMAIL
  .add('dettaglioEmail', 'Dettaglio email')
  .add(
    'responseDettaglioEmailKO',
    'Errore durante il recupero delle informazioni della Email'
  )

  .add('downloadAllegatiOK', 'Allegati scaricati con successo')
  .add('downloadAllegatiKO', 'Errore nello scaricamento degli allegati')

  //RICERCA AVANZATA
  .add('ricercaAvanzata', 'Ricerca avanzata')
  .add('annullaRicercaAvanzata', 'Annulla ricerca avanzata')
  .add('modificaRicercaAvanzata', 'Modifica ricerca avanzata')
  .add('statoInvioRicerca', 'Stato invio')
  .add('dataDa', 'Data inserimento DA')
  .add('dataA', 'Data inserimento A')
  .add('emailDirectionRicerca', 'Direzione')
  .add('statoProtocollazione', 'Protocollazione')

  // BOTTONI DRAWER RICERCA AVANZATA
  .add('search', 'Cerca')
  .add('cancel', 'Annulla');
