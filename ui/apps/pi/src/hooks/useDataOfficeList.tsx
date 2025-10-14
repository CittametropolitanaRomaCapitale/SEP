import { createContext, useContext } from 'react';
import { useGetApiOfficeQuery } from '@cmrc/services/sso';

const GetOfficeListContext =
  createContext<ReturnType<typeof useGetApiOfficeQuery>>(null);

export const GetOfficeListProvider = ({ children }) => {
  const query = useGetApiOfficeQuery({});

  return (
    <GetOfficeListContext.Provider value={query}>
      {children}
    </GetOfficeListContext.Provider>
  );
};

export const useGetQueryOfficeList = () => useContext(GetOfficeListContext);
