import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Storicizzazione');

dictionary
  .add('storico', 'Storico')
  .add('storicoTabellaVuota', 'Non ci sono ancora dati storicizzati')
  .add('filtraPerCdr', "Operazioni dell'ufficio :cdr")
  .add('storicoCompleto', 'Tutte le operazioni')
  //Tabella
  .add('tsCreation', 'data')
  .add('utente', 'utente')
  .add('operazione', 'operazione')
  .add('note', 'note')
  
  //Export
  .add('esportaStorico', 'Esporta storico')
  .add('exportAsExcel', 'Esporta in formato EXCEL')
  .add('exportAsPDF', 'Esporta in formato PDF')
  .add('exportOK', 'Esportazione dello storico riuscita')
  .add('exportError', "Errore durante l'esportazione dello storico")
  .add('note', 'note');
