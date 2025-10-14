import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaAllegatiDtoInput, TitolarioOutputDto, useGetAllegatiQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../../store/table/useTable';

const GetDocumentiFascicoloContext = createContext<ReturnType<typeof useGetAllegatiQuery>>(null);

export type DataDocumentiTitolarioProviderProps = {
  itemSelected: TitolarioOutputDto;
}

export const GetDataDocumentiFascicoloProvider: FCC<DataDocumentiTitolarioProviderProps> = (
  { children, itemSelected }
) => {
  const { tableData } = useTable({
    table_id: 'listaDocumentiFascicolo'
  });
  
  const datiRicercaDocumenti: RicercaAllegatiDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    idTitolario: itemSelected?.id,
  };

  const query = useGetAllegatiQuery({
    ricercaAllegatiDTO: datiRicercaDocumenti,
  },
    { skip: !itemSelected?.id }
  );

  return (
    <GetDocumentiFascicoloContext.Provider value={query}>
      {children}
    </GetDocumentiFascicoloContext.Provider>
  );
};

export const useGetDocumentiTitolarioListQuery = () =>
  useContext(GetDocumentiFascicoloContext);
