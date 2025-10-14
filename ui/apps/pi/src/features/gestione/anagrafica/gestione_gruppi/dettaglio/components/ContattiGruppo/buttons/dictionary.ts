import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Contatti gruppo buttons');

dictionary
  .add('aggiungiContatti', 'Aggiungi contatti')
  .add('aggiungiContatto', 'Aggiungi contatto')

  // Dialog
  .add('confermaEliminazioneContatto', 'Vuoi procedere con l\'eliminazione del contatto dal gruppo?')

  // Buttons
  .add('eliminaContatto', 'Elimina contatto')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')

  // Messages
  .add('deleteSuccess', 'Contatto eliminato con successo!')
