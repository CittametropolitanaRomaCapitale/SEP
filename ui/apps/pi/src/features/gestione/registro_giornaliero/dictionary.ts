import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Lista registro giornaliero');

dictionary
  .add('scaricaDocumento', 'Scarica')
  .add('cerca', 'Cerca')
  .add('visualizzaStorico', 'Visualizza storico')
  .add('storico', 'Storico')

  // CAMPI TABELLA
  .add('nome', 'Nome del file')
  .add('data', 'Data')
  .add('note', 'Note')
  .add('urn', 'URN')
  .add('esitoVersamento', 'Esito versamento')

  .add('tabellaVuotaRegistroGiornaliero', 'Nessun registro presente')
  
  // Messages
  .add('downloadRegistroGiornalieroOK', 'File scaricato con successo!')
  
  // Errors
  .add('downloadRegistroGiornalieroKO', 'Errore durante il download del file')
