import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('delegheUtente');

dictionary
  .add('deleghe', 'deleghe')
  .add('tabellaVuotaTesto', 'Non ci sono ancora deleghe')
  .add('cerca', 'cerca')
  .add('aggiungi', 'Aggiungi')
  .add('annulla', 'Annulla')
  .add('permesso', 'permesso')
  .add('cdr', 'CDR')
  .add('utente', 'Utente')
  .add('delegaAggiunta', 'Delega aggiunta con successo!')
  .add('delegaModificata', 'Delega modificata con successo!')
  .add('delegaRimossa', 'Delega rimossa con successo!')
  .add('delegaErrore', 'Si è verificato un errore')
  .add('rimuoviDelega', 'Rimuovi delega')
  .add('confermaRimuoviDelega', 'Confermi di voler eliminare la Delega?')
  .add('applicazione', 'Applicazione')
  .add('ruolo', 'Ruolo')
  .add('delegatoA', 'Delegato A altri')
  .add('delegatoDa', 'Delegato Da altri')
  .add('delegheInviate', 'Deleghe inviate')
  .add('delegheRicevute', 'Deleghe ricevute')
  .add('delegaPermessi', 'Delega permessi a altro utente')
  .add('riceviDelega', 'Ricevi delega permessi da altro utente')
  .add('delegaPermessiA', 'Delega permessi a')
  .add('dal', 'Dal')
  .add('al', 'Al')
  .add('note', 'Note')
  .add('salva', 'Salva')
  .add('delegaRicevutaDa', 'Delega ricevuta da')
  .add('permessiDelegatiA', 'Permessi delegati a')
  .add('attachments', 'Allegati')
  .add('caricaFile', 'Carica file')
  .add('allegati', 'Allegati')
  .add('cancellaAllegato', 'Cancella allegato')
  .add(
    'confermaCancellaAllegato',
    "Confermi di voler cancellare l'allegato :name?"
  )
  .add('fileEliminato', 'Allegato eliminato con successo!')
  .add('dataInferioreDataAl', "La data deve essere maggiore o uguale ad 'Al'");
