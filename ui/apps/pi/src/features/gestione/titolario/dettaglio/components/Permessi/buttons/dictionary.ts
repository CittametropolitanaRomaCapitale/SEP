import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Permessi Fascicolo buttons');

dictionary

  .add('permessiVisibilita', 'Permessi di visibilità')

  // Dialog
  .add('confermaRimuoviPermesso', 'Conferma rimozione permesso')

  // Buttons
  .add('rimuoviPermesso', 'Rimuovi permesso')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')

  // Form
  .add('cdr', 'Ufficio')
  .add('utenti', 'Utenti')
  .add('permesso', 'Permesso')
  .add('note', 'Note')

  .add('lettura', 'Lettura')
  .add('scrittura', 'Scrittura')

  // Form info

  // Titles
  .add('gerarchia', 'Gerarchia')
  .add('nome', 'Nome')

  // Messages
  .add('insertSuccess', 'Permesso salvato con successo!')
  .add('deleteSuccess', 'Permesso eliminato con successo!')

  // Errors
  .add('insertKO', 'Salvataggio del Permesso non avvenuto!')
  .add('deleteNotSuccess', 'Non è stato possibile eliminare il permesso')
  

  // Action

  // Table


  // fILTERS
