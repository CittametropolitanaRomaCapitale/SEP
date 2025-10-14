import { RicercaReferentiProtocolloDtoInput, useGetReferentiProtocolloQuery } from "@cmrc/services/src/app/piapi/generated";
import { FCC } from "@cmrc/types/FCC";
import { createContext, useContext } from "react";
import { useTable } from "../../../../store/table/useTable";

const GetDataReferentiProtocolloContext = createContext<ReturnType<typeof useGetReferentiProtocolloQuery>>(null);

export const GetDataReferentiProtocolloProvider: FCC<{ nProtocollo: string }> = ({
  nProtocollo,
  children
}) => {
  const { tableData } = useTable({
    table_id: 'assegnatariList'
  });

  const ricercaReferentiProtocollo: RicercaReferentiProtocolloDtoInput = {
    page: tableData?.page || 0,
    size: 5,
    sort: tableData?.sort || undefined,
    numero: nProtocollo,
    nomeDestinatario: undefined,
    statoProtocollo: undefined,
    tipoUtenteList: ["utente", "ufficio"],
    excludeStatoRifiutato: false,
    attribuzioneList: ["competenza"]
  }

  const query = useGetReferentiProtocolloQuery({
    ricercaReferentiProtocollo
  }, {
    skip: !nProtocollo
  });

  return (
    <GetDataReferentiProtocolloContext.Provider value={query}>
      {children}
    </GetDataReferentiProtocolloContext.Provider>
  );
};

export const useGetQueryReferentiProtocollo = () =>
  useContext(GetDataReferentiProtocolloContext);
