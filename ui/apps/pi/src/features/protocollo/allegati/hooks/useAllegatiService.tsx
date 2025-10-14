import { Allegato } from "@cmrc/services/src/app/piapi/generated";
import { configurazioniFormProtocollo } from "../../../../hooks/useConfigurazioniFormProtocollo";
import { AllegatoUploadStatuses, AllegatoDownloadStatuses, AllegatoTimbroPosizione } from "../../../../utils/types";

// Definizione del tipo AllegatoTable contenente i campi della tabella degli allegati
export type AllegatoTable = Allegato & {
  id: string;
  name: string;
  size: number;
  uploadStatus: AllegatoUploadStatuses;
  downloadStatus: AllegatoDownloadStatuses;
  posizioneTimbro: AllegatoTimbroPosizione;
  abortController: AbortController;
  idAllegato: number;
  isInoltro?: boolean;
  isAllegatoToAdd?: boolean;
};

export const useAllegatiService = () => {
  const { allegatiObbligatori } = configurazioniFormProtocollo();
    
  /**
   * Funzione che indica se lanciare l'errore 'allegati necessari'
   * @param numeroAllegati - Lista di allegati in tabella
   * @param tabellaIsDirty - indica significa che sulla tabella è stato caricato un file e poi rimosso
   * @returns:boolean
   */
  const showAllegatiFormError = (numeroAllegati: number, tabellaIsDirty: boolean) => 
    numeroAllegati === 0 && tabellaIsDirty && allegatiObbligatori;
  
  /**
   * Funzione che determina se gli allegati sono necessari sulla base della lista di allegati e la configurazione centralizzata
   * @param numeroAllegati - Lista di allegati in tabella
   * @param allegatiObbligatori - indica significa che sulla tabella è stato caricato un file e poi rimosso
   * @returns:boolean
   */
  const isAllegatiNecessari = (numeroAllegati: number) => numeroAllegati === 0 && allegatiObbligatori;

  /**
   * Controllo se tutti gli allegati della tabella hanno un id, ovvero che tutti siano stati caricati sul bucket (minio) 
   * @param allegati - Lista di allegati in tabella
   * @returns:boolean
  */
  const areAllAllegatiLoaded = (allegati:AllegatoTable[]) => allegati.every(allegato => allegato.idAllegato !== null);
  
  return {
    showAllegatiFormError,
    isAllegatiNecessari,
    areAllAllegatiLoaded
  }
}