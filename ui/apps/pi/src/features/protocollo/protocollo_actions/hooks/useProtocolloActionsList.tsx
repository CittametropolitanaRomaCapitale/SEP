import {
  StatoProtocollo,
  useLazyDettaglioProtocolloQuery
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../dictionary';
import { useOffice } from '@cmrc/auth/useOffice';

export const useProtocolloActionsList = () => {
  const { cdrCode, isUserProtocollatore, isUserArchivista, isUserPIAdmin } =
    useOffice();
  const [getDettaglioByNumeroProtocollo] = useLazyDettaglioProtocolloQuery();

  const getDettaglio = async (nProtocollo) => {
    let response;
    try {
      response = await getDettaglioByNumeroProtocollo({
        nProtocollo,
        selectedOffice: cdrCode
      }).unwrap();
    } catch (error) {
      toast.error(error);
    }
    return response;
  };
  const getActions = (from, dettaglioProtocollo) => {
    const actionsList = [];
    const isAnnullamento =
      dettaglioProtocollo?.richiestaAnnullamento ||
      dettaglioProtocollo?.annulla;
    switch (from) {
      case 'dettaglioProtocollo':
        actionsList.push(dictionary.get('inviaPecPeo'));
        actionsList.push(dictionary.get('generaBarcode'));
        actionsList.push(dictionary.get('generaRicevuta'));
        actionsList.push(dictionary.get('exportStorico'));
        actionsList.push(dictionary.get('downloadAllegati'));
        (isUserArchivista || isUserProtocollatore || isUserPIAdmin) &&
          actionsList.push(dictionary.get('clona'));
        break;

      case 'protocolli':
        if (
          dettaglioProtocollo?.statoProtocollo ===
          StatoProtocollo.DaPrendereInCarico
        ) {
          actionsList.push(dictionary.get('prendiInCarico'));
        }
        if (
          dettaglioProtocollo?.statoProtocollo === StatoProtocollo.PresoInCarico
        ) {
          actionsList.push(dictionary.get('classifica'));
        }
        if (dettaglioProtocollo?.assegna) {
          actionsList.push(dictionary.get('assegna'));
        }
        if (dettaglioProtocollo?.rifiuta) {
          actionsList.push(dictionary.get('rifiuta'));
        }
        if (isAnnullamento) {
          const actionAnnulla = dettaglioProtocollo?.annulla
            ? dictionary.get('annulla')
            : dictionary.get('richiestaAnnullamento');
          actionsList.push(actionAnnulla);
        }
        if (dettaglioProtocollo?.gestioneAnnullamento) {
          actionsList.push(dictionary.get('gestRichiestaAnnullamento'));
        }
        actionsList.push(dictionary.get('inviaPecPeo'));
        actionsList.push(
          // dictionary.get('inoltraRispondiPecPeo'),
          dictionary.get('aggiungiNote'),
          dictionary.get('visualizzaStorico'),
          dictionary.get('exportStorico'),
          (isUserArchivista || isUserProtocollatore || isUserPIAdmin) &&
            dictionary.get('clona'),
          dictionary.get('generaBarcode'),
          dictionary.get('generaRicevuta'),
          dictionary.get('downloadAllegati')
        );
        break;

      default:
        break;
    }
    return actionsList;
  };

  return {
    getActions,
    getDettaglio
  };
};
