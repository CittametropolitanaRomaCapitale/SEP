import { GridEventListener, GridRowModel } from '@mui/x-data-grid';
import { debounce } from '@mui/material/utils';

/**
 * Sistema che consente di aggiornare in maniera rapida gli elementi della GridRow di MUI.
 * Utilizzata per la sezione allegati del protocollo.
 * Recupera i dati modificati dallo state del componente (collocazione telemati e oggetto).
 * Processa i dati riconoscendo se ci sono state modifiche ed invia con un 'debounce', alle funzioni, 
 * che si occupano di aggiornare i dati e li prepara per essere inviati alla submit.
 * Il debounce è utili per prevenire troppi render in caso si scriva velocemente nella cella di input.
 * @param processRowUpdate 
 * @returns
 */
export const usehandleStateChanger = (processRowUpdate: (row: GridRowModel) => void) => {
  
  const handleStateChange: GridEventListener<'stateChange'> = (() => {
    let lastProcessedRowId = null;
    let lastProcessedState = null;

    const debouncedProcessRowUpdate = debounce((rowToUpdate) => {
      processRowUpdate(rowToUpdate);
    }, 100);

    return (state) => {
      const rowId = state.rowSelection[0];

      if (rowId === lastProcessedRowId && state === lastProcessedState) {
        return;
      }

      lastProcessedRowId = rowId;
      lastProcessedState = state;

      const rowSelected: any = state?.editRows?.[rowId];
      if (!rowSelected) {
        return;
      }

      const collocazione = rowSelected?.collocazioneTelematica?.value;
      const oggetto = rowSelected?.oggetto?.value;
      const rowToUpdate: GridRowModel = state?.rows?.dataRowIdToModelLookup?.[rowId];

      if (!rowToUpdate) {
        return;
      }

      let hasChanges = false;

      if (rowToUpdate.collocazioneTelematica !== collocazione) {
        rowToUpdate.collocazioneTelematica = collocazione;
        hasChanges = true;
      }
      if (rowToUpdate.oggetto !== oggetto) {
        rowToUpdate.oggetto = oggetto;
        hasChanges = true;
      }

      if (hasChanges) {
        debouncedProcessRowUpdate(rowToUpdate);
      }
    };
  })();

  return { handleStateChange };
};