import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Protocollo');

dictionary
  // PULSANTI
  .add('invia', 'Invia')
  .add('salva', 'Salva')
  .add('annulla', 'Annulla')

  // DATI MINIMI
  .add('tipologiaRegistrazione', 'Tipologia di Registrazione')
  .add('mittente', 'Mittente')
  .add('destinatari', 'Destinatari')
  .add('oggetto', 'Oggetto')
  .add('protocolloMittente', 'Protocollo Mittente')
  .add('nProtocolloEmergenza', 'Numero Protocollo Emergenza')
  .add('dataProtocolloEmergenza', 'Data Protocollo di Emergenza')
  .add('note', 'Note')
  .add('corpo', 'Corpo')
  .add('indirizzo', 'Indirizzo')
  .add('invioMultiplo', 'Invio multiplo')
  .add('invioTag', 'Inserisci Tag')
  .add('tag', 'Tag')

  .add('protocolloSalvato', 'Protocollo inviato correttamente')
  .add('protocolloAggiornato', 'Protocollo aggiornato correttamente')
  .add('circolareSalvata', 'Circolare inviata correttamente')
  .add('circolareAggiornata', 'Circolare aggiornata correttamente')

  .add(
    'invioMultiploTooltip',
    'Permette di inviare la PEC/Email separatamente ai singoli destinatari per competenza'
  )
  .add(
    'flagTagTooltip',
    'Seleziona i tag per etichettare il protocollo. Un protocollo etichettato non sarà assegnato e la selezione dei destinatari sarà impedita.'
  )

  // METODO DI SPEDIZIONE
  .add('metodoDiSpedizione', 'Metodo di Spedizione')
  .add('metodoDiSpedizioneAMano', 'A Mano')
  .add('metodoDiSpedizioneAccreditamentoWeb', 'Accreditamento WEB')
  .add('metodoDiSpedizioneCorriere', 'Corriere')
  .add('metodoDiSpedizioneEmail', 'Email')
  .add('metodoDiSpedizioneMepa', 'Mepa')
  .add('metodoDiSpedizioneNotificaAtti', 'Notifica Atti')
  .add('metodoDiSpedizionePec', 'Pec')
  .add('metodoDiSpedizioneSportello', 'Sportello')
  .add('metodoDiSpedizioneTracciabilita', 'Tracciabilit\u00E0')
  .add('metodoDiSpedizioneRaccomandata', 'Raccomandata A/R')
  .add('metodoDiSpedizioneRaccomandataSemplice', 'Raccomandata Semplice')
  .add('metodoDiSpedizionePostaPrioritaria', 'Posta Prioritaria')

  // DESTINATARI
  .add('dataProtocolloMittente', 'Data del protocollo Mittente')
  .add('email', 'Email')
  .add('destinatario', 'Destinatario')

  // Validazione
  .add(
    'invalidNumProt',
    '"Protocollo Mittente" non valido, sono ammessi solo valori numerici'
  )
  .add('maxCaratteri', 'Limite di caratteri consentito: :max')
  .add(
    'invalidNumProt',
    '"Protocollo Mittente" non valido, sono ammessi solo valori numerici'
  )

  // ERRORI RESPONSE
  .add('protocolloNonSalvato', 'Problema durante il salvataggio del protocollo')
  .add(
    'protocolloNonAggiornato',
    "Problema durante l'aggiornamento del protocollo"
  )
  .add('circolareNonSalvata', 'Problema durante il salvataggio della cricolare')
  .add(
    'circolareNonAggiornata',
    "Problema durante l'aggiornamento della circolare"
  )
  .add('uploadDocumentoKO', 'Errore durante il caricamento del documento')

  // RIEPILOGO PROTOCOLLO
  .add('numero', 'Numero')
  .add('dataDiRegistrazione', 'Data di registrazione')
  .add('oraDiRegistrazione', 'Ora di registrazione')
  .add('inseritoDa', 'Inserito da')
  .add('stato', 'Stato')
  .add('cdr', 'Ufficio')

  // ACTIONS
  .add('clona', 'Clona')
  .add('generaBarcode', 'Genera barcode')
  .add('generaRicevuta', 'Genera ricevuta')
  .add('inoltraRispondiPecPeo', 'Inoltra/Rispondi PEC/PEO')
  .add('visualizzaStorico', 'Visualizza storico')
  .add('classifica', 'Classifica')
  .add('assegna', 'Assegna')
  .add('scaricaDocumentoPrincipale', 'Scarica documento principale')
  .add('aggiungiAllegati', 'Aggiungi allegati')
  .add('aggiungiNote', 'Aggiungi note')
  .add('rifiuta', 'Rifiuta')
  .add('annulla', 'Annulla')
  .add('richiestaAnnullamento', 'Richiesta di annullamento')
  .add('gestRichiestaAnnullamento', 'Gestisci richiesta di annullamento')
  .add('inviaPecPeo', 'Invia PEC/PEO')
  .add('inviaPEC', 'Invia PEC')
  .add('inviaPEO', 'Invia PEO')
  .add('downloadAllegati', 'Download Allegati')
  .add('exportStorico', 'Esporta storico')
  .add('exportStoricoExcel', 'Esporta EXCEL')
  .add('exportStoricoPdf', 'Esporta PDF')

  // DIALOG
  .add('richiestaAnnullamentoTitle', 'Richiesta di annullamento')
  .add('annullaTitle', 'Annulla')
  .add('storico', 'Storico')

  // FROM - pagina di provenienza
  .add('protocolli', 'protocolli')
  .add('dettaglioProtocollo', 'dettaglioProtocollo')

  // RESPONSE ACTIONS
  .add('barcodeResponseOK', 'Codice a barre generato con successo')
  .add('barcodeResponseKO', 'Errore durante la generazione del codice a barre')
  .add('ricevutaResponseOK', 'Ricevuta generata con successo')
  .add('ricevutaResponseKO', 'Errore durante la generazione della ricevuta')
  .add('downloadDocumentoPrincipaleWarn', 'Documento principale non presente')
  .add(
    'downloadDocumentoPrincipaleResponseOK',
    'Documento principale scaricato con successo'
  )
  .add(
    'downloadDocumentoPrincipaleResponseKO',
    'Errore durante il download del docuemnto principale'
  )
  .add('presaInCaricoOK', 'Presa in carico avvenuta con successo')
  .add('presaInCaricoKO', 'Errore durante la presa in carico')
  .add('downloadAllegatiOK', 'Download allegati avvenuto con successo')
  .add('downloadAllegatiKO', 'Errore durante il download degli allegati')

  // ALTRI CAMPI
  .add('titolario', 'Titolario')

  // STATI PROTOCOLLO
  .add('DaPrendereInCarico', 'Da prendere in carico')
  .add('prendiInCarico', 'Prendi in carico')
  .add('PresoInCarico', 'Preso in carico')

  // HEADER PROTOCOLLO CIRCOLARE
  .add('protocolloCircolare', 'Protocollo circolare');
