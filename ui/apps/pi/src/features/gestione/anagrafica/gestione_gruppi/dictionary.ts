import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('ListaGruppi');

dictionary
  .add('gruppi', 'Gruppi')
  .add('dettaglioGruppo', 'Dettaglio gruppo')

  .add('cerca', 'Cerca un gruppo')

  // Colonne della lista Gruppi
  .add('nome', 'Nome')
  .add('note', 'Note')
  .add('dataCreazione', 'Data di creazione')

  .add('tabellaVuotaGruppi', 'Nessun gruppo presente')

  .add('gruppoSalvato', 'Gruppo salvato con successo!')
  .add('gruppoModificato', 'Gruppo modificato con successo!')

  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('salva', 'Salva')
  .add('procedi', 'Procedi')
