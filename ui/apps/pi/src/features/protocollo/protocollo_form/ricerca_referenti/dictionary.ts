import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ProtocolloForm');

dictionary
  // Headers
  .add('destinatariHeader', 'Destinatari')

  // Dialog title
  .add('rubrica', 'Rubrica')

  // PULSANTI
  .add('aggiungi', 'Aggiungi')
  .add('annulla', 'Annulla')
  .add('cerca', 'Cerca')
  .add('aggiungiContatto', 'Aggiungi contatto')
  .add('indietro', 'Indietro')

  // Ricerca
  .add('cercaContatti', 'Cerca contatti')

  // FORM
  .add('destinatariCompetenza', 'Destinatari per competenza')
  .add('destinatariConoscenza', 'Destinatari per conoscenza')
  .add('mittente', 'Mittente')

  // Colonne della lista Anagrafica
  .add('ragioneSociale', 'Ragione sociale')
  .add('nome', 'Nome')
  .add('cognome', 'Cognome')
  .add('cfPiva', 'CF/P.Iva')
  .add('pec', 'PEC')
  .add('email', 'Email')
  .add('indirizzo', 'Indirizzo')
  .add('citta', 'Città')

  .add('tabellaVuotaAnagrafica', 'Nessun contatto presente')
  .add('tabellaVuotaGruppi', 'Nessun gruppo presente')

  // Colonne lista Gruppi
  .add('note', 'Note')

  // Tabs referenti
  .add('anagrafica', 'Anagrafica interna')
  .add('gruppi', 'Gruppi')
  .add('ipa', 'IPA')
  .add('inad', 'INAD')
  .add('usePEOInsteadOfPEC', 'Per tutti i contatti attualmente selezionati, utilizza come destinatario l\'indirizzo E-mail invece della PEC')

  .add(
    'tabellaVuotaIPA',
    'Nessuna amministrazione trovata. Controlla il criterio di ricerca.'
  )
  .add(
    'tabellaVuotaIPAUO',
    'Nessun UO trovato. Torna indietro per la lista degli enti.'
  )
  .add(
    'tabellaVuotaIPAAOO',
    'Nessun AOO trovato. Torna indietro per la lista degli UO.'
  )
  .add('IPA_get_dettaglio_aoo', 'Dettaglio AOO')
  .add('IPA_get_dettaglio_uo', 'Dettaglio UO')
  .add('IPA_ente_label', 'Ente')
  .add('IPA_ente_acronimo', 'Acronimo')
  .add('IPA_ente_codAmm', 'Codice Ente')
  .add('IPA_ente_dettagli', 'Dettagli')
  .add('IPA_codAOO', 'Codice AOO')
  .add('IPA_codUniOU', 'Codice OU')
  .add('IPA_cfPiva', 'C.F./P.IVA')
  .add('IPA_uo_label', 'UO')
  .add('IPA_aoo_label', 'AOO')
  .add('IPA_aoo_indirizzo', 'Indirizzo')
  .add('IPA_aoo_citta', 'Città')
  .add('IPA_aoo_pec', 'PEC')

  .add('indiceIpaLink', 'https://www.indicepa.gov.it/ipa-portale/')
  .add(
    'indiceInadLink',
    'https://domiciliodigitale.gov.it/dgit/home/public/#!/home'
  );
