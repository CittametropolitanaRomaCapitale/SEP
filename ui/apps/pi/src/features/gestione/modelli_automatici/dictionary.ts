import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Configurazione Modelli Automatici');

dictionary
  .add('headerTitle', 'Configurazione Modelli Automatici')

  .add('tabellaVuotaModelliAutomatici', 'Nessun modello automatico presente')
  .add('updateSuccess', 'Aggiornamento effettuato')
  .add('saveSuccess', 'Salvataggio effettuato')
  .add('saveSuccessWithErrors', 'Salvataggio effettuato')
  .add('saveError', 'Salvataggio non effettuato')
  .add('updateError', 'Aggiornamento non effettuato')
  .add('titolarioJustOne', 'Non è possibile specificare più di un fascicolo')
  .add('annulla', 'Annulla')
  .add('salva', 'Salva')
  .add('aggiungi', 'Aggiungi')
  .add('aggiungiModello', 'Aggiungi modello')
  .add('modelloEliminato', 'Eliminazione effettuata')
  .add('eliminaModello', 'Elimina')
  .add('confermaEliminaModello', 'Vuoi eliminare il modello :nome?')
  .add('procedi', 'Conferma')
  .add('modificaModello', 'Modifica')
  .add('cerca', 'Cerca')


  // Campi FORM
  .add('nessunModelloDisponibile', 'Nessun modello disponibile')
  .add('nome', 'Nome del modello')
  .add('nomeTooltip', 'Il nome del modello automatico')
  .add('oggetto', 'Oggetto del protocollo')
  .add('oggettoTooltip', 'Il testo che sarà inserito nel protocollo')
  .add('metodo', 'Metodo di spedizione')
  .add('metodoTooltip', 'Il metodo di spedizione che sarà inserito nel protocollo')
  .add('tipoRegistrazione', 'Tipo di registrazione')
  .add('tipoRegistrazioneTooltip', 'Il tipo di registrazione che sarà inserito nel protocollo')
  .add('cdr', 'Ufficio')
  .add('titolario', 'Fascicolo')