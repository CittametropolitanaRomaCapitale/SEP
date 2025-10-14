import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ClassificaProtocollo');

dictionary
  // TITOLO DIALOG CLASSIFICAZIONE
  .add('classifica', 'Classifica')

  // PULSANTI
  .add('annulla', 'Annulla')
  .add('conferma', 'Conferma')

  // RESPONSE ASSEGNAZIONE
  .add('fascicolazioneOK', 'Protocollo fascicolato con successo!')
