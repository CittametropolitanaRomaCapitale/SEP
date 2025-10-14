import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('AnagraficaForm');

dictionary
  // CAMPI ANAGRAFICA FORM
  .add('ragioneSociale', 'Ragione sociale (o Nome e Cognome se persona fisica)')
  .add('nome', 'Nome')
  .add('cognome', 'Cognome')
  .add('cfPiva', 'CF/P.Iva')
  .add('indirizzo', 'Indirizzo')
  .add('citta', 'Città')
  .add('cap', 'CAP')
  .add('provincia', 'Prov.')
  .add('email', 'Email')
  .add('pec', 'PEC')
  .add('telefono', 'Telefono')
  .add('fax', 'Fax')
  .add('gruppi', 'Gruppi')
  .add('note', 'Note')
  .add('cercaContatto', 'Effettua la ricerca della PEC su INAD')

  //CAMPI OBBLIGATORI
  .add('campoRequired', 'Inserisci almeno indirizzo e città, email, o pec')

  // INVALID MESSAGES CHECK FORMALI
  .add('invalidEmail', 'Email non valida')
  .add('invalidPec', 'PEC non valida')
  .add('invalidCf', 'Codice fiscale non valido')
  .add('invalidPiva', 'P.Iva non valida')
  .add('invalidCap', 'CAP non valido')
  .add('invalidProvincia', 'Prov. non valida')
  .add('invalidTelephone', 'Telefono non valido')
  .add('invalidFax', 'Fax non valido');
