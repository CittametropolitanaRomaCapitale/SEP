import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Ricerca Titolario');

dictionary
  // Headers

  // PULSANTI
  .add('aggiungi', 'Aggiungi')
  .add('annulla', 'Annulla')
  .add('cerca', 'Cerca nel titolario, almeno 3 caratteri')
  .add('indietro', 'Indietro')

  // Ricerca
  .add('cercaTitolario', 'Cerca nel titolario')
  .add('nessunRisultato', 'Nessun risultato trovato')
  .add('loadMoreResults', 'Carica più risultati')
  .add('filtri', 'Filtri')
  .add('hideFascicoliDeleted', 'Nascondi fascicoli eliminati')
  .add('showFascicoliWithDocumenti', 'Mostra solo fascicoli con documenti')
  .add('showFascicoliWithProtocolli', 'Mostra solo fascicoli con protocolli')

  // ICONE
  .add(
    'numDocumenti',
    ':numero documenti non protocollati nel fascicolo ed in tutti i sottofascicoli'
  )
  .add(
    'numProtocolli',
    ':numero protocolli nel fascicolo ed in tutti i sottofascicoli'
  )

  .add('RimuoviFascicolo', 'Rimuovi fascicolo')
  .add('SelezionaFascicolo', 'Seleziona fascicolo')

  // FORM
  .add('titolario', 'Titolario')
  .add('fascicoloEliminatoTooltip', 'Eliminato')
  .add('fascicoloChiusoTooltip', 'Chiuso')

  // TIPOLOGIE TITOLARIO
  .add('titolo', 'TITOLO')
  .add('sezione', 'SEZIONE')
  .add('sottoSezione', 'SOTTOSEZIONE')
  .add('fascicoloLv1', 'FASCICOLO DI 1° LIVELLO')
  .add('fascicoloLvN', 'FASCICOLO DI 2° LIVELLO O SUPERIORE')
  .add('fascicoloChiuso', 'FASCICOLO CHIUSO');
