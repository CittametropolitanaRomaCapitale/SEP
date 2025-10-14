import { useCallback } from 'react';

/**
 * Funzione callback che consente di passare la row modificata alle funzioni che mappano i dati sulla tabellaAllegati
 *  e quindi al DTO di input.
 * @param onUpdatedFile 
 * @returns
 */

export const useRowUpdateHandler = (onUpdatedFile) => {
  const processRowUpdate = useCallback(
    (newRow) => {
      const updatedRow = { ...newRow };
      onUpdatedFile(updatedRow);
    },
    [onUpdatedFile]
  );

  return { processRowUpdate };
};