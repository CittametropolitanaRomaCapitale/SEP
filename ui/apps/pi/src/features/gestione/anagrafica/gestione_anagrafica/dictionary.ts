import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ListaAnagrafica');

dictionary
  .add('anagrafica', 'Anagrafica')
  .add('headerTitle', 'Contatti Anagrafica')

  .add('cerca', 'Cerca un contatto')

  // Colonne della lista Anagrafica
  .add('ragioneSociale', 'Ragione sociale')
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
  .add('note', 'Note')
  .add('certificato', 'Contatto certificato')

  .add('tabellaVuotaAnagrafica', 'Nessun contatto presente')

  .add('contattoSalvato', 'Contatto e destinatario aggiunti con successo!')
  .add('contattiImportatiOK', 'Contatti importati con successo!')
  .add('contattiImportatiKO', 'Errore durante il caricamento dei contatti!')

  .add('importaAnagraficaButton', 'Importa anagrafica')

  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('salva', 'Salva')
  .add('procedi', 'Procedi')

  //Recupero contato inad
  .add('contattoRecuperato', 'Contatto recuperato con successo')
  .add('erroreRecuperoContatto', 'Errore durante il recupero del contatto');
