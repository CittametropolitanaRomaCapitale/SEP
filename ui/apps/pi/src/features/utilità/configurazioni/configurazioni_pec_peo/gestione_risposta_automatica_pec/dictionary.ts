import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>(
  'CampiPecEscluseRispostaAutomatica'
);

dictionary
  .add(
    'configurazioniPecEscluseRispostaAutomatica',
    'Configurazioni riposta automatica PEC'
  )
  .add(
    'infoTooltip',
    'Blacklist delle caselle a cui il sistema non invierà risposte automatiche di protocollazione'
  )

  // Filter
  .add('cerca', 'Cerca')
  // Tabella
  .add('indirizzo', 'Indirizzo')
  .add('dataCreazione', 'Data Creazione')
  .add('tabellaVuotaPecEscluse', 'Non ci sono ancora PEC configurate')
  .add('aggiungi', 'Aggiungi')
  // Actions
  .add('aggiungiPecEsclusa', 'Aggiungi PEC')
  .add('modificaPecEsclusa', 'Modifica PEC')
  // Drawer
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('procedi', 'Procedi')
  .add('salva', 'Salva')
  // Salvataggio
  .add('pecEsclusaSalvata', 'PEC salvata con successo')
  // Eliminazione
  .add('eliminaPecEsclusa', 'Elimina PEC')
  .add(
    'confermaEliminaPecEsclusa',
    "Vuoi procedere con l'eliminazione della PEC :title?"
  )
  .add('successEliminazione', 'PEC eliminato con successo')
  //Modifica
  .add('pecEsclusaModificata', 'PEC modificata con successo');
