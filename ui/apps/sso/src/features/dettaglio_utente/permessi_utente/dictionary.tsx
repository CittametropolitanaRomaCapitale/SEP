import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('permessiUtente');

dictionary
  .add('permessi', 'permessi')
  .add('aggiungiPermesso', 'Aggiungi permesso')
  .add('tabellaVuotaTesto', 'Non ci sono ancora permessi')
  .add('cerca', 'cerca')
  .add('aggiungi', 'Aggiungi')
  .add('annulla', 'Annulla')
  .add('permesso', 'permesso')
  .add('cdr', 'CDR')
  .add('type', 'Tipo')

  .add('permessoAggiunto', 'Permesso aggiunto con successo!')
  .add('permessoRimosso', 'Permesso rimosso con successo!')
  .add('permessoErrore', 'Si è verificato un errore')
  .add('rimuoviPermesso', 'Rimuovi permesso')
  .add('confermaRimuoviPermesso', 'Confermi di voler eliminare il permesso?')
  .add('applicazione', 'Applicazione')
  .add('ruolo', 'Ruolo')
  .add('delegatoA', 'Delegato A altri')
  .add('delegatoDa', 'Delegato Da altri')
  .add('applicazioni', 'Applicazioni')
  .add('ruolo', 'Ruolo')
  .add('cdr', 'CDR')
  .add('tutteApplicazioni', 'Tutte le applicazioni');
