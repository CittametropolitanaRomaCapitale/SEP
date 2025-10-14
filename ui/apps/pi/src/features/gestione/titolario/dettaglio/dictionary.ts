import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Dettaglio Fascicolo');

dictionary
  .add('titolario', 'Titolario')
  .add('permessiVisibilita', 'Permessi di visibilità')

  // Dialog

  // Buttons
  .add('aggiungi', 'Aggiungi permesso')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')

  // Form
  .add('nome', 'Nome')
  .add('note', 'Note')
  .add('tsChiusura', 'Data di chiusura')
  .add('tsDeleted', 'Data di eliminazione')
  .add('aggiungiNote', 'Aggiungi delle note')

  // Form info

  // Titles
  .add('gerarchia', 'Gerarchia')
  .add('nome', 'Nome')
  .add('ufficioCreazione', 'Ufficio di creazione')
  .add('inseritoDa', 'Inserito da')
  .add('dataInserimento', 'Data di inserimento')
  .add('stato', 'Stato')

  // Messages
  .add('updateSuccess', 'Permesso salvato con successo!')
  .add('deleteSuccess', 'Permesso eliminato con successo!')
  .add('deleteNotSuccess', 'Eliminazione non avvenuta')

  // Errors

  // Action

  // Table
  .add('tabellaVuotaPermessiTesto', 'Non ci sono ancora permessi ')


  // fILTERS
