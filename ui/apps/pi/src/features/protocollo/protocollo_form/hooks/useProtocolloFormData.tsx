import { MetodoSpedizione, ProtocolloInputInput, TipoRegistrazione, useLazyGetPecPeoByTipologiaPostaQuery } from '@cmrc/services/src/app/piapi/generated';
import { useOffice } from '@cmrc/auth/useOffice';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { DatiUtenteSso } from '@cmrc/services';
import { useGetApiUserByIdQuery } from '@cmrc/services/sso';
import { MOCK_PEC_PEO } from '../../../../utils/const';
import { dictionary } from '../../dictionary';
import { useDataUsersOfficesList } from '../../../../hooks/useDataUsersOfficesList';

export interface LabelValue {
  label: string;
  value: string;
}

export const useProtocolloFormData = () => {
  const { cdrCode } = useOffice();
  const { user } = useAuth();
  const userInfo: DatiUtenteSso = useGetApiUserByIdQuery({
    id: Number(user?.selectedOffice?.user_id)
  }).data;
  const [getPecPeoByTipologiaPosta] = useLazyGetPecPeoByTipologiaPostaQuery();
  const { usersList: utentiDestinatari, officeList: ufficiDestinatari, fetchData: fetchDataUserOffice } = useDataUsersOfficesList();


  function buildUserOptions(userArray: any[], outputEmail: boolean) {
    return userArray?.map((data) => ({
      label: outputEmail ? `${data.nome} ${data.cognome} (${data.email})` : `${data.nome} ${data.cognome}`,
      value: `${data.id}`
    }));
  }

  const getTipologieRegistrazione = () => Object.values(TipoRegistrazione);
  const getMetodiSpedizione = () => Object.values(MetodoSpedizione);

  const getPecPeo = async (metodoSpedizione, readMode, indirizzoPecPeo) => {
    let dataPecPeo: any = [];

    if (MOCK_PEC_PEO) {
      if (metodoSpedizione === dictionary.get('metodoDiSpedizioneEmail')) {
        dataPecPeo = [
          'notification@parsec326.it',
          'andrea.dematteis@parsec326.it',
          'lorenzo.petraroli@parsec326.it',
          'simone.spinelli@parsec326.it',
          'salvatore.versienti@parsec326.it',
          'gioacchino.defusco@parsec326.it',
        ];
      }
      else if (metodoSpedizione === dictionary.get('metodoDiSpedizionePec')) {
        dataPecPeo = [
          'sviluppo@pec.parsec326.it',
          'roberto.pisan0@pec.it',
        ];
      }
    }
    else {
      const response = await getPecPeoByTipologiaPosta({
        tipologiaPosta: metodoSpedizione,
        selectedCdrCode: cdrCode,
        idUtente: `${userInfo?.auth_id}`
      }).unwrap()
      
      dataPecPeo = response?.getPecPeoByTipologiaPosta

      if (readMode)
        dataPecPeo = [...dataPecPeo, indirizzoPecPeo]
    }
    return dataPecPeo
  }

  const getDestinatariList = (metodoSpedizione) => {
    let dataDestinatari: any[];
    const isPecPeo = metodoSpedizione === dictionary.get('metodoDiSpedizioneEmail') || metodoSpedizione === dictionary.get('metodoDiSpedizionePec');

    if (isPecPeo) {
      dataDestinatari = [
        { id: 7, nome: 'Antonello', cognome: 'Celima', email: 'a.celima@cittametropolitanaroma.it' },
        { id: 8, nome: 'Andrea', cognome: 'Giordano', email: 'a.giordano@cittametropolitanaroma.it' },
        { id: 9, nome: 'Andrea', cognome: 'Stefanini', email: 'a.stefanini@cittametropolitanaroma.it' },
        { id: 10, nome: 'Andrea', cognome: 'De Matteis', email: 'andrea.dematteis@parsec326.it' },
        { id: 11, nome: 'Gioacchino', cognome: 'De Fusco', email: 'gioacchino.defusco@parsec326.it' },
        { id: 12, nome: 'Simone', cognome: 'Spinelli', email: 'simone.spinelli@parsec326.it' },
        { id: 13, nome: 'Salvatore', cognome: 'Versienti', email: 'salvatore.versienti@parsec326.it' },
        { id: 14, nome: 'Lorenzo', cognome: 'Petraroli', email: 'lorenzo.petraroli@parsec326.it' },
        { id: 15, nome: 'Sviluppo', cognome: 'Parsec', email: 'sviluppo@pec.parsec326.it' }
      ];
    } else {
      fetchDataUserOffice()
      return [...utentiDestinatari, ...ufficiDestinatari]

    }
    return buildUserOptions(dataDestinatari, isPecPeo);
  };

  const useFindProtocolliQueryMock = (numeroProtocollo: string, anno: number) => {
    let dettaglioProtocollo: ProtocolloInputInput;

    if (numeroProtocollo === "123" && anno === 2023) {
      // Dato mock per ora
      dettaglioProtocollo = {
        nProtocollo: numeroProtocollo,
        tsCreation: "2023-11-14 10:20:00",
        // idMittente: "1",
        stato: "Da pretrata",
        metodoSpedizione: "PEC",
        // destinatari?: any,
        oggetto: "Oggetto del protocollo 123",
        protocolloMittente: "123",
        dataProtocolloMittente: new Date(),
        note: "Note del protocollo 123"
      };
    } else if (numeroProtocollo === "456") {
      // Dato mock per ora
      dettaglioProtocollo = {
        nProtocollo: numeroProtocollo,
        tsCreation: "2023-11-14 10:20:00",
        // idMittente: "2",
        stato: "Da prendere in carico",
        tipoRegistrazione: "Entrata",
        metodoSpedizione: "PEC",
        // destinatari?: any,
        oggetto: "Oggetto del protocollo 456",
        protocolloMittente: "456",
        dataProtocolloMittente: new Date(),
        note: "Note del protocollo 456"
      };
    }

    return {
      data: dettaglioProtocollo,
      isLoading: false
    }
  }

  return {
    getTipologieRegistrazione,
    getMetodiSpedizione,
    // getDestinatariList,
    getPecPeo,
    useFindProtocolliQueryMock
  };
};
