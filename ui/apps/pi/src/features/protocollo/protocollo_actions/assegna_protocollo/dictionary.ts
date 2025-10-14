import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Assegnazione');

dictionary
  // TITOLO DIALOG ASSEGNAZIONE
  .add('assegna', 'Assegna')

  // PULSANTI
  .add('annulla', 'Annulla')
  .add('assegna', 'Assegna')

  // CAMPI FORM ASSEGNAZIONE
  .add('assegnatari', 'Assegnatari')
  .add('note', 'Note')

  // RESPONSE ASSEGNAZIONE
  .add('assegnazioneOK', ':numero assegnato con successo!')
  .add('assegnazioneKO', "Errore durante l'assegnazione");
