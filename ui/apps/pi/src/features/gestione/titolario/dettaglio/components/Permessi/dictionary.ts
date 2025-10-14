import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Permessi Fascicolo');

dictionary

  .add('permessiVisibilita', 'Permessi di visibilità')

  // Dialog
  .add('confermaEliminazionePermesso', "Vuoi procedere con l'eliminazione del permesso?")

  // Buttons
  .add('aggiungiPermesso', 'Aggiungi permesso')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  
  // Titles
  .add('eliminaPermesso', 'Elimina permesso')

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
  .add('deleteKO', 'Non è stato possibile eliminare il permesso')
  

  // Action

  // Table
  .add('permesso', 'permesso')
  .add('cdr', ' Ufficio')
  .add('username', 'username')
  .add('utente', 'utente')
  .add('note', 'note')
  .add('tabellaVuotaPermessiTesto', 'Non ci sono ancora permessi ')


  // fILTERS
  .add('cerca', 'Cerca')
  .add('permesso', 'Permesso')
  .add('cdr', 'Ufficio')
  .add('letturaScrittura', 'Lettura/Scrittura')
