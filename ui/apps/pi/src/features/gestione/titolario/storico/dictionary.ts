import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('TitolarioStorico');

dictionary
.add('storico', 'Storico del titolario')
.add('storicoTabellaVuota', 'Non ci sono ancora dati storicizzati')

//Tabella
.add('tsCreation', 'data')
.add('utente', 'utente')
.add('operazione', 'operazione')
.add('note', 'note')