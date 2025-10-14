import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaAnagraficaDtoInput, useGetAllAnagraficaQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../../../../../store/table/useTable';

const GetContattiCertificatiListContext = createContext<ReturnType<typeof useGetAllAnagraficaQuery>>(null);

export const GetContattiCertificatiListProvider: FCC<{ children }> = ({
  children
}) => {
  const { tableData } = useTable({
    table_id: 'contattiCertificati'
  });

  const ricercaContattiCertificati: RicercaAnagraficaDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 20,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    onlyCertified: true
  }

  const query = useGetAllAnagraficaQuery({
    ricercaAnagraficaDTO: ricercaContattiCertificati
  }
  );

  return (
    <GetContattiCertificatiListContext.Provider value={query}>
      {children}
    </GetContattiCertificatiListContext.Provider>
  );
};

export const useGetQueryContattiCertificatiList = () => useContext(GetContattiCertificatiListContext);
