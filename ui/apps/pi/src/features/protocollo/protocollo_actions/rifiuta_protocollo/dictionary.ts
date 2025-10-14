import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Rifiuta');

dictionary
  // PULSANTI
  .add('rifiuta', 'Rifiuta')
  .add('rifiuta', 'Rifiuta')
  .add('rifiutaOk', ':numero rifiutato con successo')
  .add('motivazione', 'Motivazione')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add(
    'aggiungereNota',
    'Stai per rifiutare :numero, specifica la motivazione'
  )
  