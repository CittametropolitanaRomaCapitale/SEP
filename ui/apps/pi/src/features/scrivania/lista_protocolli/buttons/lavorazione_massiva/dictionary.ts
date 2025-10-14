import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Lavorazione massiva');

dictionary
  // Dialog
  .add('rifiutaMassivoDialog', 'Rifiuto massivo')
  .add('classificaMassivoDialog', 'Classificazione massiva')
  .add('assegnaMassivoDialog', 'Assegnazione massiva')
  .add(
    'notaRifiuto',
    'Stai per rifiutare i protocolli selezionati, specifica la motivazione'
  )

  // Button
  .add('assegna', 'Assegna')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')

  // Options
  .add('lavorazioneMassiva', 'Lavorazione massiva')
  .add('prendiInCaricoMassivo', 'Prendi in carico')
  .add('classificazioneMassiva', 'Classifica')
  .add('assegnaMassivo', 'Assegna')
  .add('rifiutaMassivo', 'Rifiuta')

  // form
  .add('assegnatari', 'Assegnatari')
  .add('motivazione', 'Motivazione')
  .add('note', 'Note')

  // Messages
  .add(
    'rifiutoMassivoOk',
    'I Protocolli/Circolari selezionati sono stati rifiutati con successo!'
  )
  .add(
    'assegnazioneMassivaOk',
    'I Protocolli/Circolari selezionati sono stati assegnati con successo!'
  )
  .add(
    'fascicolazioneMassivaOK',
    'I Protocolli/Circolari selezionati sono stati classificati con successo!'
  )

  .add(
    'presaInCaricoMassivaOK',
    'I Protocolli/Circolari selezionati sono stati presi in carico con successo!'
  );
