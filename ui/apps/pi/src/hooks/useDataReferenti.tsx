import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaReferentiDtoInput, TipologiaRubrica, useFindReferentiQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../store/table/useTable';

interface GetDataReferentiProviderProps {
    metodoSpedizione?: string;
    tipoRegistrazione: string;
    isInad?: boolean;
    tipoRicercaIPA?: string;
    ipaSelectedCodAmm?: string;
    ipaSelectedCodAoo?: string;
    isMittente?: boolean;
    tipologiaRubrica?: TipologiaRubrica;
}

const GetDataReferentiContext = createContext<ReturnType<typeof useFindReferentiQuery>>(null);

export const GetDataReferentiProvider: FCC<GetDataReferentiProviderProps> = ({
    children,
    metodoSpedizione,
    tipoRegistrazione,
    tipoRicercaIPA,
    ipaSelectedCodAmm,
    ipaSelectedCodAoo,
    isInad,
    isMittente,
    tipologiaRubrica
}) => {
    const { tableData } = useTable({
        table_id: 'ricercaReferenti'
    });

    let sortToSend = {"by": "tsCreation", desc: true};
    if (tableData?.sort !== undefined && tableData?.sort !== null) {
        sortToSend.by = tableData?.sort.by;
        sortToSend.desc = tableData?.sort.desc; 
    }
    if(tipologiaRubrica === 'GRUPPI') {
        if (sortToSend.by !== 'nome') {
            sortToSend.by = 'nome';
        }
    }
    else if (tipologiaRubrica === 'ANAGRAFICA_INTERNA') {
        if (sortToSend.by === 'nome') {
            sortToSend.by = 'ragioneSociale';
        }
    }

    const datiRicercaReferenti: RicercaReferentiDtoInput = {
        search: tableData?.search,
        tipoRicercaIPA,
        ipaCodAoo: ipaSelectedCodAoo,
        ipaCodAmm: ipaSelectedCodAmm,
        ricercaINAD: isInad || false,
        tipoRegistrazione: tipoRegistrazione || undefined,
        metodoSpedizione: metodoSpedizione || undefined,
        noCache: true,
        size: 10,
        sort: sortToSend,
        page: tableData?.page || 0,
        mittente: isMittente || false,
        tipologiaRubrica: tipologiaRubrica || undefined
    };

    const query = useFindReferentiQuery({
        search: datiRicercaReferenti
    });

    return (
        <GetDataReferentiContext.Provider value={query}>
            {children}
        </GetDataReferentiContext.Provider>
    );
};

export const useGetReferentiList = () =>
    useContext(GetDataReferentiContext);
