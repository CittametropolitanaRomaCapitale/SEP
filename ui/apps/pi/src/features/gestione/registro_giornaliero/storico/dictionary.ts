import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Storico registro giornaliero');

dictionary.add('storico', 'Storico')
  .add('visualizzaStorico', 'Visualizza storico')
  .add('storicoTabellaVuota', 'Non ci sono ancora dati storicizzati')
  .add('operazione', 'Operazione')
  .add('note', 'Note')
  .add('tsCreation', 'Data')
