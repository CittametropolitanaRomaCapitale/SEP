import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('RuoliAmministrazione');

dictionary
  .add('ruoliDiAmministrazione', 'Ruoli di amministrazione')
  .add('aggiungiRuolo', 'Aggiungi ruolo di amministrazione')
  .add('tabellaVuotaTesto', 'Non ci sono ancora ruoli di amministrazione')
  .add('aggiungi', 'Aggiungi')
  .add('annulla', 'Annulla')
  .add('ruoloAggiunto', 'Ruolo di amministrazione aggiunto con successo!')
  .add('ruoloRimosso', 'Ruolo di amministrazione rimosso con successo!')
  .add('ruoloErrore', 'Si è verificato un errore')
  .add('rimuoviRuolo', 'Rimuovi ruolo di amministrazione')
  .add(
    'confermaRimuoviRuolo',
    'Confermi di voler eliminare il ruolo di amministrazione :name?'
  )
  .add('applicazione', 'Applicazione')
  .add('ruolo', 'Ruolo')
  .add('applicazioni', 'Applicazioni')
  .add('ruolo', 'Ruolo')
  .add('tutteApplicazioni', 'Tutte le applicazioni');
