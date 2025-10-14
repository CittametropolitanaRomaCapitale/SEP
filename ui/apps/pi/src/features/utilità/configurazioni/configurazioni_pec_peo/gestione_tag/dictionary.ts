import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('CampiTag');

dictionary
  .add('configurazioniTag', 'Configurazioni tag')

  // Filter
  .add('cerca', 'Cerca')
  // Tabella
  .add('nome', 'Nome')
  .add('tabellaVuotaTag', 'Non ci sono ancora tag configurati')
  .add('aggiungi', 'Aggiungi')
  // Actions
  .add('aggiungiTag', 'Aggiungi Tag')
  .add('modificaTag', 'Modifica tag')
  // Drawer
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('procedi', 'Procedi')
  .add('salva', 'Salva')
  // Salvataggio
  .add('tagSalvato', 'Tag salvato con successo')
  // Eliminazione
  .add('eliminaTag', 'Elimina tag')
  .add(
    'confermaEliminaTag',
    "Vuoi procedere con l'eliminazione del tag :title?"
  )
  .add('successEliminazione', 'Tag eliminato con successo')
  //Modifica
  .add('tagModificato', 'Tag modificato con successo');
