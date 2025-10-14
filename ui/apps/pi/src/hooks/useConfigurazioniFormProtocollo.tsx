import { MOCK_ALLEGATI } from "../utils/const";

export type Configurazioni = {
  maxLengthProtocolloOggetto?: number,
  maxLengthFilenameAllegato?: number,
  maxUploadSize?: number,
  allegatiObbligatori?: boolean
}

/**
  * @param maxLengthProtocolloOggetto -lunghezza massima in caratteri dell'oggetto di un protocollo
  * @param maxLengthFilenameAllegato - lunghezzza massima del nome di un file allegato permesso
  * @param maxUploadSize - dimensione massima degli allegati di cui fare l'upload, espressa in byte
  * @param allegatiObbligatori - determina se si può salvare un protocollo senza allegati
  * @returns ConfigurazioniProtcolloForm
  */
export const configurazioniFormProtocollo = (): Configurazioni => MOCK_ALLEGATI
  ? {
    maxLengthProtocolloOggetto: 200,
    maxLengthFilenameAllegato: 150,
    maxUploadSize: 100 * 1024 * 1024,
    allegatiObbligatori: true
  }
  : null /* Qui verrà chiamato il servizio per restituire le configurazioni */;


/**
* @param maxLengthProtocolloOggetto -lunghezza massima in caratteri dell'oggetto di un protocollo
* @param maxLengthFilenameAllegato - lunghezzza massima del nome di un file allegato permesso
* @param maxUploadSize - dimensione massima degli allegati di cui fare l'upload, espressa in byte
* @param allegatiObbligatori - determina se si può salvare un protocollo senza allegati
* @returns ConfigurazioniProtcolloForm
*/

export const configurazioniTitolario = (): Configurazioni => MOCK_ALLEGATI
  ? {
    maxUploadSize: 100 * 1024 * 1024,
    maxLengthFilenameAllegato: 150,
  }
  : null /* Qui verrà chiamato il servizio per restituire le configurazioni */;
