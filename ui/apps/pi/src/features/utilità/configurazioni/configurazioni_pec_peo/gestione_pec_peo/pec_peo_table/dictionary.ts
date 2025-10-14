import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('CampiPostaElettronica');

dictionary
  .add('configurazioniPecPeo', 'Configurazioni PEC/PEO')

  .add('attivaSelezionati', 'Attiva selezionati')
  .add('disattivaSelezionati', 'Disattiva selezionati')
  .add('eliminaSelezionati', 'Elimina selezionati')

  // Filter
  .add('cerca', 'Cerca')
  .add('pec', 'PEC')
  .add('peo', 'PEO')
  .add('tipo', 'Tipo')
  .add('cdr', 'Ufficio')

  .add('tipologiaPosta', 'configurazione')
  .add('ufficio', 'ufficio')
  .add('username', 'username')
  .add('utente', 'utente')
  .add('indirizzo', 'Indirizzo')
  .add('username', 'Username')
  .add('password', 'Password')

  .add('tabellaVuotaPecPeo', 'Non ci sono ancora PEC/PEO configurate')
  .add('aggiungi', 'Aggiungi')
  .add('aggiungiPecPeo', 'Aggiungi PEC/PEO')
  .add('gestioneMonitoraggio', 'Gestione monitoraggio casella')
  .add('modificaPecPeo', 'Modifica PEC/PEO')

  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('procedi', 'Procedi')
  .add(
    'confermaEliminaPecpeo',
    "Vuoi procedere con l'eliminazione della posta elettronica?"
  );
