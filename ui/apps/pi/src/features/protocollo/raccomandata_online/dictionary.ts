import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Raccomandata');

dictionary
  // RACCOMANDATA TABLE
  .add('syncButton', 'Aggiorna le informazioni')
  .add('raccomandataOnline', 'Raccomandata online')
  .add('tabellaVuotaRaccomandata', 'Nessuna raccomandata inviata')
  .add('cerca', 'Cerca')
  .add('numeroRaccomandata', 'N° Raccomandata')
  .add('idRaccomandata', 'ID Raccomandata')
  .add('tipoRaccomandata', 'Tipo')
  .add('costoRaccomandata', 'Costo')
  .add('statoRaccomandata', 'Stato raccomandata')
  .add('statoConsegna', 'Stato consegna')
  .add('tsInserimento', 'Data invio')
  .add('tsConsegna', 'Data consegna')
  .add('tsCreation', 'Data creazione')

  .add(
    'tooltipNormalizzazione',
    "L'indirizzo del destinatario contiene errori relativi a CAP, città e/o provincia"
  )

  // ANNULLA RACCOMANDATA
  .add('annullaRaccomandata', 'Annulla raccomandata')
  .add('motivazioneAnnullamento', 'Motivazione')
  .add(
    'aggiungiMotivazione',
    'Stai per annullare la raccomandata, specifica la motivazione'
  )

  // PULSANTI
  .add('creaRaccomandata', 'Crea raccomandata')
  .add('invia', 'Invia')
  .add('annulla', 'Annulla')
  .add('procedi', 'Procedi')

  // CAMPI FORM
  // Documento
  .add('documentoHeader', 'Documento')
  .add('nomeFile', 'Nome file')
  .add('descrizione', 'Descrizione')

  // Mittente
  .add('mittenteHeader', 'Mittente')

  .add('mittente', 'Mittente')
  .add('ulterioreDatoMittente', 'Dipartimento / Servizio')
  .add('indirizzoMittente', 'Indirizzo')
  .add('indirizzo2Mittente', 'Presso')
  .add('civicoMittente', 'Civico')
  .add('cittaMittente', 'Città')
  .add('capMittente', 'CAP')
  .add('provinciaMittente', 'Provincia')

  // Destinatario
  .add('destinatarioHeader', 'Destinatario')
  .add('destinatario', 'Destinatario')
  .add('compilaForm', 'Compila form')
  .add('selectDestinatario', 'Seleziona destinatario')
  .add('indirizzoDestinatario', 'Indirizzo')
  .add('indirizzo2Destinatario', 'Presso')
  .add('civicoDestinatario', 'Civico')
  .add('cittaDestinatario', 'Città')
  .add('capDestinatario', 'CAP')
  .add('provinciaDestinatario', 'Provincia')

  // Tipologia invio
  .add('tipologiaInvioHeader', 'Tipologia di invio')

  .add('tipoSpedizione', 'Tipo spedizione')

  // MESSAGES
  .add('raccomandataOK', 'Raccomandata inserita con successo!')
  .add('updateSuccess', 'Informazioni aggiornate con successo!')
  .add('updateNotNeeded', 'Le informazioni risultano già aggiornate')
  .add('annullaRaccomandataOK', 'Raccomandata annullata con successo!')

  // ERRORS
  .add('invalidProvincia', 'Provincia non valida')
  .add(
    'invalidDenominazione',
    'Denominazione non valida: inserire almeno 3 caratteri'
  )
  .add('invalidPresso', 'Campo non valido: inserire cognome mittente')
  .add(
    'annullaRaccomandataKO',
    "Errore durante l'annullamento della raccomandata"
  )
  .add('invalidCap', 'CAP non valido')
  .add('allegatoRequired', "Il campo 'Allegati' è obbligatorio")
  .add('raccomandataKO', "Errore durante l'inserimento della raccomandata")
  .add('updateKO', "Errore durante l'aggiornamento delle informazioni")

  // DIALOG
  .add('titleRaccomandataDialog', 'Raccomandata - N° Protocollo: ')
  .add('dettaglioRaccomandata', 'Dettaglio raccomandata');
