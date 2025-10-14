import {
  StatoProtocollo,
  Allegato,
  EmailBaseFragment,
  MetodoSpedizione,
  TipoRegistrazione,
  TitolarioOutputDto,
  DettaglioProtocolloDto,
  Tag
} from '@cmrc/services/src/app/piapi/generated';
import { useOffice } from '@cmrc/auth/useOffice';
import {
  AllegatoDownloadStatuses,
  AllegatoTimbroPosizione,
  AllegatoUploadStatuses
} from '../../../../utils/types';
import { AllegatoTable } from './useAllegatiService';
import { PECActionType } from '../../../../store/email/emailSlice';
import { buildBody } from '../../../../utils/email_utilities';
import { useGetQueryDettaglioProtocollo } from '../../useDataDettaglioProtocollo';

export const useBuildDatiDettaglioProtocollo = (
  readMode: boolean,
  emailData: EmailBaseFragment,
  pecAction: PECActionType,
  mode: string
) => {
  const { cdr, shortCdrDesc, cdrCode } = useOffice();

  const { data: defaultValues } = useGetQueryDettaglioProtocollo();
  let initialData: any;
  let initialAllegati: Array<AllegatoTable> = [];

  if (emailData) {
    switch (pecAction) {
      case 'rispondiConProtocollo':
        initialData = {
          tipoRegistrazione: TipoRegistrazione.Uscita,
          metodoSpedizione: MetodoSpedizione.Pec,
          oggetto: `Re: ${emailData?.oggetto}`,
          corpoPecPeo: buildBody(emailData),
          // La PEC in uscita di risposta verrà inviata al mittente della PEC a cui si sta rispondendo
          destinatariCompetenza: [
            {
              label: emailData.from,
              value: emailData.from,
              tipo: 'anagrafica_interna'
            }
          ],
          destinatariConoscenza: [],
          canUpdateProtocollo: true
        };
        break;

      case 'inoltraConProtocollo':
        initialData = {
          tipoRegistrazione: TipoRegistrazione.Uscita,
          metodoSpedizione: MetodoSpedizione.Pec,
          oggetto: `Fw: ${emailData?.oggetto}`,
          corpoPecPeo: buildBody(emailData),
          destinatariCompetenza: [],
          destinatariConoscenza: [],
          canUpdateProtocollo: true
        };
        initialAllegati = emailData.protocollo.allegati
          .filter(
            (allegato) => allegato.isMain && allegato.estensione === '.eml'
          )
          .map((allegato: Allegato) => {
            const newAllegato: AllegatoTable = {
              isMain: true,
              id: allegato.riferimentoMinio,
              name: allegato.nome,
              nome: allegato.nome,
              oggetto: allegato.oggetto,
              collocazioneTelematica: allegato.collocazioneTelematica,
              uploadStatus: AllegatoUploadStatuses.UPLOADED,
              downloadStatus: AllegatoDownloadStatuses.READY,
              abortController: new AbortController(),
              idAllegato: allegato.id,
              posizioneTimbro: AllegatoTimbroPosizione.TOP,
              estensione: allegato.estensione,
              size: allegato.dimensione,
              dimensione: allegato.dimensione,
              isInoltro: true,
              isAllegatoToAdd: false
            };
            return newAllegato;
          });
        break;

      default:
        break;
    }
  }

  if (readMode) {
    initialData = {
      tipoRegistrazione:
        defaultValues?.dettaglioProtocollo?.protocollo?.tipoRegistrazione,
      metodoSpedizione:
        defaultValues?.dettaglioProtocollo?.protocollo?.metodoSpedizione,
      mittente: defaultValues?.dettaglioProtocollo?.protocollo?.mittente,
      protocolloMittente:
        defaultValues?.dettaglioProtocollo?.protocollo?.protocolloMittente,
      dataProtocolloMittente:
        defaultValues?.dettaglioProtocollo?.protocollo?.dataProtocolloMittente,
      nProtocolloEmergenza:
        defaultValues?.dettaglioProtocollo?.protocollo?.nProtocolloEmergenza,
      dataProtocolloEmergenza:
        defaultValues?.dettaglioProtocollo?.protocollo?.dataProtocolloEmergenza,
      oggetto: defaultValues?.dettaglioProtocollo?.protocollo?.oggetto,
      note: defaultValues?.dettaglioProtocollo?.protocollo?.note,
      idTitolario: defaultValues?.dettaglioProtocollo?.titolario.map(
        (item: TitolarioOutputDto) => ({
          id: item?.id,
          idPadre: item?.idPadre,
          label: item?.label,
          tipologia: item?.tipologia,
          hierarchyString: item?.hierarchyString,
          visible: item?.visible
        })
      ),
      nProtocolloCircolare:
        defaultValues?.dettaglioProtocollo?.protocollo?.nProtocolloCircolare,
      indirizzoPecPeo:
        defaultValues?.dettaglioProtocollo?.protocollo?.indirizzoPecPeo,
      corpoPecPeo: defaultValues?.dettaglioProtocollo?.protocollo?.corpoPecPeo,
      invioEmailMultiplo:
        defaultValues?.dettaglioProtocollo?.protocollo?.invioEmailMultiplo,
      cdr: defaultValues?.dettaglioProtocollo?.protocollo?.cdr,
      destinatariCompetenza:
        defaultValues?.dettaglioProtocollo?.destinatariCompetenza?.map(
          (item) => ({ label: item?.label, value: item?.idDestinatario })
        ) || [],
      destinatariConoscenza:
        defaultValues?.dettaglioProtocollo?.destinatariConoscenza?.map(
          (item) => ({ label: item?.label, value: item?.idDestinatario })
        ) || [],
      formTagList:
        defaultValues?.dettaglioProtocollo?.tagList?.map(
          (tag: { nome: Tag }) => ({ label: tag?.nome, value: tag })
        ) || [],
      flagTag: defaultValues?.dettaglioProtocollo?.tagList?.length > 0,
      canUpdateProtocollo:
        defaultValues?.dettaglioProtocollo?.statoProtocollo ===
          StatoProtocollo.PresoInCarico ||
        defaultValues?.dettaglioProtocollo?.protocolAuthor ||
        defaultValues?.dettaglioProtocollo?.canPrendereInCaricoFromPec,
      nProtocollo: defaultValues?.dettaglioProtocollo?.protocollo?.nProtocollo
    };
    initialAllegati =
      defaultValues?.dettaglioProtocollo?.protocollo?.allegati.map(
        (allegato: Allegato) => {
          const newAllegato: AllegatoTable = {
            ...allegato,
            ...{
              idAllegato: allegato.id,
              id: allegato.riferimentoMinio,
              name: allegato.nome,
              size: allegato.dimensione,
              uploadStatus: AllegatoUploadStatuses.UPLOADED,
              downloadStatus: AllegatoDownloadStatuses.READY,
              posizioneTimbro: AllegatoTimbroPosizione.TOP,
              abortController: null,
              isAllegatoToAdd: false,
              isMain: allegato.isMain
            }
          };
          return newAllegato;
        }
      );
  }
  if (mode === 'clona') {
    const isMittenteUfficio =
      defaultValues?.dettaglioProtocollo?.protocollo?.tipoRegistrazione ===
        TipoRegistrazione.Circolare ||
      defaultValues?.dettaglioProtocollo?.protocollo?.tipoRegistrazione ===
        TipoRegistrazione.Interno ||
      defaultValues?.dettaglioProtocollo?.protocollo?.tipoRegistrazione ===
        TipoRegistrazione.Uscita;

    let mittenteDaClonare = isMittenteUfficio
      ? {
          tipo: 'ufficio',
          idMittente: cdrCode,
          label: `${cdr} - ${shortCdrDesc}`
        }
      : {
          idMittente:
            defaultValues?.dettaglioProtocollo?.protocollo?.idMittente,
          label: defaultValues?.dettaglioProtocollo?.protocollo?.mittente,
          tipo: 'anagrafica_interna'
        };
    let destCompetenzaDaClonare =
      defaultValues?.dettaglioProtocollo?.destinatariCompetenza || [];
    let destConoscenzaDaClonare =
      defaultValues?.dettaglioProtocollo?.destinatariConoscenza || [];

    if (
      defaultValues?.dettaglioProtocollo?.protocollo?.tipoRegistrazione ===
      TipoRegistrazione.Uscita
    ) {
      destCompetenzaDaClonare =
        defaultValues?.dettaglioProtocollo?.destinatariCompetenza?.map(
          (item) => ({
            ...item,
            isIpa: false,
            tipo: 'anagrafica_interna',
            tipoDestinatario: 'anagrafica_interna'
          })
        ) || [];
      destConoscenzaDaClonare =
        defaultValues?.dettaglioProtocollo?.destinatariConoscenza?.map(
          (item) => ({
            ...item,
            isIpa: false,
            tipo: 'anagrafica_interna',
            tipoDestinatario: 'anagrafica_interna'
          })
        ) || [];
    }

    initialData = {
      tipoRegistrazione:
        defaultValues?.dettaglioProtocollo?.protocollo?.tipoRegistrazione,
      metodoSpedizione:
        defaultValues?.dettaglioProtocollo?.protocollo?.metodoSpedizione,
      mittente: mittenteDaClonare,
      protocolloMittente:
        defaultValues?.dettaglioProtocollo?.protocollo?.protocolloMittente,
      dataProtocolloMittente:
        defaultValues?.dettaglioProtocollo?.protocollo?.dataProtocolloMittente,
      oggetto: defaultValues?.dettaglioProtocollo?.protocollo?.oggetto,
      note: '',
      idTitolario: defaultValues?.dettaglioProtocollo?.titolario.map(
        (item: TitolarioOutputDto) => ({
          id: item?.id,
          idPadre: item?.idPadre,
          label: item?.label,
          tipologia: item?.tipologia,
          hierarchyString: item?.hierarchyString,
          visible: item?.visible
        })
      ),
      nProtocolloCircolare: '',
      indirizzoPecPeo:
        defaultValues?.dettaglioProtocollo?.protocollo?.indirizzoPecPeo,
      corpoPecPeo: defaultValues?.dettaglioProtocollo?.protocollo?.corpoPecPeo,
      invioEmailMultiplo:
        defaultValues?.dettaglioProtocollo?.protocollo?.invioEmailMultiplo,
      cdr: defaultValues?.dettaglioProtocollo?.protocollo?.cdr,
      destinatariCompetenza: destCompetenzaDaClonare,
      destinatariConoscenza: destConoscenzaDaClonare,
      formTagList:
        defaultValues?.dettaglioProtocollo?.tagList?.map(
          (tag: { nome: Tag }) => ({ label: tag?.nome, value: tag })
        ) || [],
      flagTag: defaultValues?.dettaglioProtocollo?.tagList?.length > 0,
      canUpdateProtocollo: true,
      nProtocollo: null
    };
    initialAllegati = [];
  }

  return {
    initialData,
    initialAllegati
  };
};
