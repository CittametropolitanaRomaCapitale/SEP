import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ListaUtenti');

dictionary
  .add('username', 'Username')
  .add('tabellaVuotaTesto', 'Non ci sono ancora utenti')
  .add('cerca', 'cerca')
  .add('aggiungiUtenti', 'Aggiungi utenti')
  .add('eliminaSelezionati', 'Elimina selezionati')
  .add('utenti', 'Utenti')
  .add('annulla', 'Annulla')
  .add('salva', 'Salva')
  .add('utentiAggiunti', 'Utenti aggiunti con successo!')
  .add('utenteEliminato', 'Utente eliminato con successo!')
  .add(
    'utentePermessiEliminati',
    'Utente e relativi permessi eliminati con successo!'
  )
  .add('utentiEliminati', 'Utenti eliminati con successo!')
  .add('errore', 'Si è verificato un errore')
  .add('eliminaUtente', 'Elimina utente ')
  .add(
    'confermaEliminaUtente',
    "Confermi di voler eliminare l'utente :name ed i suoi relativi permessi?"
  )
  .add('eliminaUtenti', 'Elimina utenti selezionati ')
  .add(
    'confermaEliminaUtenti',
    'Confermi di voler eliminare gli utenti selezionati?'
  )
  .add('modificaUfficio', 'Modifica ufficio')
  .add('gestioneUtenti', 'Gestione Utenti')
  .add('aggiungiUfficio', 'Aggiungi ufficio')
  .add('ufficio', 'Ufficio')
  .add('uffici', 'Uffici')
  .add('mantieniUtenti', "Mantieni utenti nell' ufficio corrente")
  .add('mantainOfficeActive', 'Mantieni ufficio da unire attivo')
  .add('spostaUtenti', 'Sposta tutti gli utenti')
  .add('gestisciUtenti', 'Gestisci utenti da spostare')
  .add('mantieni', 'Mantieni')
  .add('sposta', 'Sposta')
  .add('spostaUtenti', 'Sposta utenti')
  .add('salvaModifiche', 'Salva Modifiche')
  .add(
    'salvaModificheIrreversibili',
    "Vuoi salvare le modifiche effettuate? L'azione è irreversibile"
  )
  .add('suddividi', 'Suddividi')
  .add('suddividiUfficio', 'Suddividi ufficio')
  .add('modificheSalvate', 'Modifiche salvate con successo!')
  .add('utentiSpostati', 'Utenti spostati con successo!')
  .add('modificheErrore', 'Si è verificato un errore durante il salvataggio')
  .add('chiudiUfficio', 'Chiudi Ufficio')
  .add('riapriUfficio', 'Riapri Ufficio')
  .add('confermaChiudiUfficio', "Confermi di voler chiudere l'ufficio :name?")
  .add('chiudiUfficioDefinitivamente', 'Chiudi Ufficio Definitivamente')
  .add(
    'confermaChiudiUfficioDefinitivamente',
    "Confermi di voler chiudere l'ufficio :name definitivamente?"
  )
  .add('confermaRiapriUfficio', "Confermi di voler riaprire l'ufficio :name?")
  .add('ufficioChiuso', 'Ufficio chiuso con successo!')
  .add(
    'ufficioChiusoDefinitivamente',
    'Ufficio chiuso definitivamente con successo!'
  )
  .add('ufficioRiaperto', 'Ufficio riaperto con successo!')
  .add('chiuso', 'CHIUSO')
  .add('chiusoDefinitivamente', 'CHIUSO DEFINITIVAMENTE')
  .add('name', 'CDR')
  .add('office_start_date', 'Inizio')
  .add('office_end_date', 'Fine')
  .add('last_update', 'Ultima modifica')
  .add('state', 'Stato')
  .add('dirigente', 'Dirigente')
  .add('description', 'Descrizione')
  .add('service', 'Servizio')
  .add('short_description', 'Descrizione Breve')
  .add('cronologia', 'Cronologia :name')
  .add('in', "è entrato a far parte dell'ufficio")
  .add('out', "non fa più parte dell'ufficio")
  .add('deletedOffice', 'è stato chiuso')
  .add('createOffice', 'è stato creato')
  .add('reopenedOffice', 'è stato riaperto')
  .add('belongingOffice', 'è stato associato a :name')
  .add('nome', 'Nome')
  .add('cognome', 'Cognome')
  .add('bloccaUffico', 'Blocca accesso ufficio')
  .add(
    'confermaBloccaUfficio',
    "Confermi di voler bloccare l'accesso all'ufficio :name?"
  )
  .add('sbloccaUffico', 'Sblocca accesso ufficio')
  .add(
    'confermaSbloccaUfficio',
    "Confermi di voler sbloccare l'accesso all'ufficio :name?"
  )
  .add('ufficioBloccato', 'Accesso ufficio bloccato con successo!')
  .add('ufficioSbloccato', 'Accesso ufficio sbloccato con successo!')
  .add('bloccato', 'Bloccato');
