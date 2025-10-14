import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('PecPeo');

dictionary
  .add('tipologiaPosta', 'Tipologia di posta')
  .add('cdr', 'Ufficio')
  .add('indirizzo', 'Indirizzo')
  .add('utente', 'Utente')
  .add('password', 'Password')
  .add('annulla', 'Annulla')
  .add('salva', 'Salva')
  .add('attiva', 'attiva')
  .add(
    'deleteMessages',
    'Abilita la cancellazione delle mail in entrata dalla Inbox'
  )
  .add('saveToSent', 'Abilita il salvataggio delle mail in uscita nella Inbox')
  .add('readPec', 'Abilita Protocollazione Automatica per PEC')
  .add('mustSendRispostaAutomatica', 'Abilita invio risposta automatica di protocollazione')

  //Monitoraggio
  .add('firstRule', 'Regola 1 - Minimo numero di PEC in entrata')
  .add('secondRule', 'Regola 2 - Massimo numero di PEC in entrata')
  .add('thirdRule', 'Regola 3 - Minimo numero di PEC in uscita')
  .add('fourthRule', 'Regola 4 - Massimo numero di PEC in uscita')
  .add('nPec', 'Numero PEC')
  .add('nMinuti', 'Minuti')
  .add('timeFrom', 'Ora DA')
  .add('timeTo', 'Ora A')
  .add('enableMonitoraggio', 'Abilita monitoraggio')
  .add('deleteRegola', 'Elimina')
  .add('deleteRegolaTitle', 'Elimina regola')
  .add('procedi', 'Procedi')
  .add('saveRegolaSuccess', 'Regola salvata con successo')
  .add('saveRegolaError', 'Errore durante il salvataggio della regola')
  .add('confirmDeleteRegola', 'Sei sicuro di voler eliminare la regola?')
  .add('deleteRegolaSuccess', 'Regola eliminata con successo')
  .add('deleteRegolaError', "Errore durante l'eliminazione della regola")

  // Tooltip
  .add(
    'deleteMessagesTooltip',
    'Se abilitata, cancella definitivamente le mail in entrata una volta lette e protocollate.'
  )
  .add(
    'saveToSentTooltip',
    'Se abilitata, salva le mail in uscita nella cartella "Inviate" della Inbox.'
  )
  .add(
    'readPecTooltip',
    'Se selezionata, abilita la protocollazione automatica per la PEC'
  )
  .add(
    'mustSendRispostaAutomaticaTooltip',
    'Se abilitata, invia una risposta automatica di protocollazione per le PEC in entrata. NOTA: le risposte automatiche NON saranno comunque inviate ai mittenti presenti nella blacklist che si trova nella sezione apposita.'
  )

  // ERRORS
  .add('invalidEmail', 'Email non valida')

  // MSG
  .add('saveSuccess', 'Configurazione salvata con successo!')
  .add('saveSuccessPlural', 'Configurazioni salvate con successo!')
  .add('updateSuccess', 'Aggiornamento avvenuto con successo!')

  // Dialog
  .add('infoTitle', 'Info')
  .add(
    'infoPt1',
    'Il sistema ha rilevato altre configurazioni PEC/PEO correlate a quella che stai modificando. Desideri aggiornare anche queste configurazioni?'
  )
  .add('infoPt2', ' ')
  .add('aggiorna', 'Aggiorna tutte')
  .add('modificaSolo', 'Modifica solo questa');
