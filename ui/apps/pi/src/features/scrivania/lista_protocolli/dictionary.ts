import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ListaProtocolli');

dictionary

  // PULSANTI TOPBAR PROTOCOLLI LIST
  .add('creaProtocollo', 'Crea protocollo / circolare')
  .add('ricercaAvanzata', 'Ricerca avanzata')
  .add('annullaRicercaAvanzata', 'Annulla ricerca avanzata')
  .add('modificaRicercaAvanzata', 'Modifica ricerca avanzata')
  .add('esportaProtocolli', 'Esporta protocolli')

  .add('stato', 'Stato')
  .add('tabellaVuotaTesto', 'Nessun dato trovato')

  // FILTRO PROTOCOLLI
  .add('iMieiCompiti', 'I miei compiti')
  .add('ilMioUfficio', 'Il mio ufficio')
  .add('all', 'ALL')

  // FILTRO NUMERO
  .add('numero', 'Numero')
  .add('numeroEmergenza', 'Numero emergenza')

  // FILTRO STATO PROTOCOLLO
  .add('inElaborazione', 'In elaborazione')

  // FILTRO TIPO PROTOCOLLO
  .add('entrata', 'Entrata')
  .add('uscita', 'Uscita')
  .add('interno', 'Interno')

  // CAMPI
  .add('metodoSpedizione', 'Metodo')
  .add('pecPeo', 'PEC/PEO')
  .add('cdr', 'Ufficio')
  .add('tipoRegistrazione', 'Tipo')
  .add('tsCreation', 'Data')
  .add('oggetto', 'Oggetto')
  .add('mittente', 'Mittente')
  .add('destinatari', 'Destinatari')
  .add('note', 'Note')
  .add('protocolloEmergenza', 'Protocollo di emergenza')
  .add('dataProtocolloEmergenza', 'Data protocollo di emergenza')
  .add('assegnatari', 'Assegnatari')
  .add('classificazione', 'Classificazione')
  .add('fascicolazione', 'Fascicolazione')
  .add('docPrincipale', 'Doc. principale')
  .add('stato', 'Stato')
  .add('cerca', 'Cerca')
  .add('ruolo', 'Ruolo')
  .add('ufficio', 'Ufficio')
  .add('tag', 'Tag')

  // FILTRO DATA DI INSERIMENTO
  .add('dataProtocolloDa', 'Data inserimento DA')
  .add('dataProtocolloA', 'Data inserimento A')
  .add('dataProtocolloEmergenzaDa', 'Data inserimento emergenza DA')
  .add('dataProtocolloEmergenzaA', 'Data inserimento emergenza A')

  // BOTTONI DRAWER RICERCA AVANZATA
  .add('search', 'Cerca')
  .add('cancel', 'Annulla')

  // EXPORT
  .add('exportOK', 'Esportazione dei protocolli riuscita ')
  .add('exportError', "Errore durante l'esportazione dei protocolli")
  .add('exportAsExcel', 'Esporta in formato EXCEL')
  .add('exportAsPDF', 'Esporta in formato PDF')

  // METODO DI SPEDIZIONE
  .add('metodoDiSpedizione', 'Metodo')
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
  .add('metodoDiSpedizionePostaPrioritaria', 'Posta Prioritaria');
