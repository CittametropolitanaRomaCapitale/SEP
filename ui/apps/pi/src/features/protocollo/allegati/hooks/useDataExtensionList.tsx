import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { useGetAllExtensionsQuery } from '@cmrc/services/src/app/piapi/generated';

const GetDataExtensionListContext = createContext<ReturnType<typeof useGetAllExtensionsQuery>>(null);

export const GetDataExtensionListProvider: FCC = ({ children }) => {
  const query = useGetAllExtensionsQuery();

  return (
    <GetDataExtensionListContext.Provider value={query}>
      {children}
    </GetDataExtensionListContext.Provider>
  );
};

export const useGetQueryExtensionList = () =>
  useContext(GetDataExtensionListContext);
