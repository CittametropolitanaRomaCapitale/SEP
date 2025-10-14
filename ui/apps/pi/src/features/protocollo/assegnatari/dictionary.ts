import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Assegnatari');

dictionary
  .add('assegnatari', 'Assegnatari')
  .add('emptySearchTable', 'Nessun assegnatario interno trovato')
  .add('assegnazioneRevocata', 'Assegnazione revocata con successo!')
  .add('revocaAssegnazione', 'Revoca assegnazione')
  .add('confermaRevoca', "Vuoi procedere con la revoca dell'assegnazione?")
  .add('annulla', 'Annulla')
  .add('procedi', 'Procedi')

  // Tabella
  .add('nome', 'Nome')
  .add('stato', 'stato')
  .add('note', 'Note');
