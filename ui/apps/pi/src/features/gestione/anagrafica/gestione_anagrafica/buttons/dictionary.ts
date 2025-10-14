import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('TableAnagraficaButtons');

dictionary
.add('annulla', 'Annulla')
.add('procedi', 'Procedi')
.add('contattoEliminato', 'Contatto eliminato con successo!')
.add('contattoNonEliminato', "Errore durante l'eliminazione del contatto")
.add('eliminaContatto', 'Elimina contatto')
.add('modificaContatto', 'Modifica contatto')
.add('dettagliContatto', 'Dettagli contatto')
.add('aggiungiContatto', 'Aggiungi contatto')
.add('aggiungi', 'Aggiungi')
.add('confermaEliminazioneContatto', "Vuoi procedere con l'eliminazione del contatto?");
