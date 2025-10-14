import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Contatti gruppo');

dictionary

  // Buttons
  .add('aggiungiContatto', 'Aggiungi contatto')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('aggiungi', 'Aggiungi')
  .add('cerca', 'Cerca')

  .add('contattiGruppo', 'Contatti gruppo')

  // Messages
  .add('addSuccess', 'Contatto/i aggiunto/i con successo!')
  .add('deleteSuccess', 'Contatto eliminato con successo!')
  .add('deleteNotSuccess', 'Eliminazione non avvenuta')

  // Table
  .add('tabellaVuotaContattiGruppo', 'Nessun contatto presente')
  .add('tabellaVuotaAnagrafica', 'Nessun contatto presente')
