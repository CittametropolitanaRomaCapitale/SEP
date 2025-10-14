import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>(
  'RicercaAvanzataListaUtenti'
);

dictionary
  .add('cerca', 'cerca')
  .add('exportAsXls', 'Esporta')
  .add('exportTitle', 'Esporta i risultati della ricerca in formato Excel')
  .add('downloadExportUtentiOK', 'Il file è stato esportato correttamente')
  .add('downloadExportUtentiKO', 'Errore nella creazione del file Excel')
  .add('annulla', 'annulla')
  .add('ricercaAvanzata', 'Ricerca avanzata')
  .add('annullaRicercaAvanzata', 'Annulla ricerca avanzata')
  .add('modificaRicercaAvanzata', 'Modifica ricerca avanzata')
  .add('applicazione', 'Applicazione')
  .add('ruolo', 'Ruolo')
  .add('type', 'Tipo permesso')
  .add('ufficio', 'Ufficio');
