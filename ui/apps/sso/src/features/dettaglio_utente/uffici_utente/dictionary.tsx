import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('UfficiUtente');

dictionary
  .add('uffici', 'Uffici')
  .add('aggiungiUffici', 'Aggiungi uffici')
  .add('tabellaVuotaTesto', 'Non ci sono ancora uffici')
  .add('cerca', 'cerca')
  .add('aggiungi', 'Aggiungi')
  .add('annulla', 'Annulla')
  .add('ufficio', 'Ufficio')
  .add('cdr', 'ufficio')
  .add('ufficioAggiunto', 'Ufficio aggiunto con successo!')
  .add('ufficiAggiunti', 'Uffici aggiunti con successo!')
  .add('ufficioRimosso', 'Ufficio rimosso con successo!')
  .add(
    'ufficioPermessiRimossi',
    'Ufficio e relativi permessi rimossi con successo!'
  )
  .add('ufficioErrore', 'Si è verificato un errore')
  .add('rimuoviUfficio', 'Rimuovi Ufficio')
  .add(
    'confermaRimuoviUfficio',
    "Confermi di voler eliminare l'associazione con l'ufficio :name ed i suoi relativi permessi?"
  )
  .add('creaUfficio', 'Crea Ufficio')
  .add('ufficioCreato', 'Ufficio creato con successo!')
  .add('nomeUfficio', 'Nome')
  .add('descrizioneUfficio', 'Descrizione')
  .add('eliminaMantieniPermessi', 'Elimina ma mantieni permessi')
  .add('eliminaTutto', 'Elimina tutto');
