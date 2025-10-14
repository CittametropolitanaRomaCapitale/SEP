import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Dettaglio Gruppo');

dictionary
  .add('gruppi', 'Gruppi')

  // Riepilogo
  .add('nome', 'Nome')
  .add('note', 'Note')
  .add('dataCreazione', 'Data di creazione')