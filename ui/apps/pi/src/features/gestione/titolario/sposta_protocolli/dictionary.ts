import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const 
dictionary = new Dictionary<any, any>('Protocolli titolario');

dictionary

  // Dialog
  .add('protocolli', 'Protocolli')

  // Buttons
  .add('aggiungi', 'Aggiungi')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('spostaProtocolli', 'Sposta protocolli')

  // Form

  // Form info

  // Titles


  // Messages
  .add('saveSuccess', 'Salvataggio avvenuto con successo!')
  .add('updateSuccess', 'Titolario aggiornato con successo!')
  .add('protocolliSpostati', 'Protocolli spostati con successo!')

  // Errors
  .add('erroreSpostamentoProtocolli', 'Errore durante lo spostamento dei protocolli')

  // Action

  // Table
  .add('metodoSpedizione', 'Metodo')
  .add('pecPeo', 'PEC/PEO')
  .add('numero', 'Numero')
  .add('cdr', 'Ufficio')
  .add('tipoRegistrazione', 'Tipo')
  .add('tsCreation', 'Data')
  .add('docPrincipale', 'Doc. Principale')
  .add('oggetto', 'Oggetto')
  .add('mittente', 'Mittente')
  .add('destinatari', 'Destinatari')
  .add('assegnatari', 'Assegnatari')
  .add('note', 'Note')
  .add('protocolloEmergenza', 'Protocollo di emergenza')
  .add('dataProtocolloEmergenza', 'Data protocollo di emergenza')
  .add('classificazione', 'Classificazione')
  .add('fascicolazione', 'Fascicolazione')
  .add('stato', 'Stato')
  .add('cerca', 'Cerca')
  .add('ruolo', 'Ruolo')
  .add('tabellaVuotaTesto', 'Nessun dato trovato')
  


