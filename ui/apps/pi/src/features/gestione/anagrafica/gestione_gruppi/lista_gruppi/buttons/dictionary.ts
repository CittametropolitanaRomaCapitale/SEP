import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('TableGruppiButtons');

dictionary
.add('procedi', 'Procedi')
.add('annulla', 'Annulla')

.add('aggiungi', 'Aggiungi')

.add('aggiungiGruppo', 'Aggiungi gruppo')
.add('modificaGruppo', 'Modifica gruppo')

.add('eliminaGruppo', 'Elimina gruppo')
.add('gruppoEliminato', 'Gruppo eliminato con successo!')
.add('gruppoNonEliminato', "Errore durante l'eliminazione del gruppo")
.add('confermaEliminazioneGruppo', "Sei sicuro di voler eliminare il gruppo? Questa operazione rimuoverà anche l'associazione con tutti i contatti in esso presenti")
