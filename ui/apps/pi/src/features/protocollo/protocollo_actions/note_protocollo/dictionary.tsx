import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('NoteProtocollo');

dictionary

  .add('msgDescrizione', 'Aggiorna le note del protocollo :n_protocollo')
  // PULSANTI
  .add('annulla', 'Annulla')
  .add('salva', 'Salva')

  // CAMPI FORM
  .add('note', 'Note')

  // RESPONSE NOTE
  .add('updateNoteOK', 'Note salvate correttamente')
  .add('updateNoteKO', 'Errore durante il salvataggio delle note');
