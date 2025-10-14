import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Use Import Emergenza');

dictionary
  .add('selectedFilename', 'File selezionato: :file')
  .add('confirmImportFile', 'Conferma selezione')
  .add('selectImportFile', 'Seleziona file')
  .add('deleteChosenFile', 'Elimina')
  .add('protocolliImportatiOK', 'Protocolli importati correttamente')
  .add('protocolliImportatiKO', 'Protocolli non importati')
  .add('nProtocolloEmergenza', 'Numero protocollo di emergenza')
  .add('nProtocollo', 'Numero di protocollo')
  .add('numeroProtocolliImportati', 'Protocolli importati: :number')
  .add('isProtocolloImported', 'Protocollo già presente')
  .add('protocolloImported', 'Sì')
  .add('protocolloNotImported', 'No')
  .add('importProtocolliDescription', 'Seleziona il file Excel per importare i protocolli di emergenza')