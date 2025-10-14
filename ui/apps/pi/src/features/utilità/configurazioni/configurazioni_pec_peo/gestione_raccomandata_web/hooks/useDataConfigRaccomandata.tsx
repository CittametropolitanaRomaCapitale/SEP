import { createContext, useContext } from 'react';
import { useGetLoginRaccomandataQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';

const GetRaccomandataConfigContext = createContext<ReturnType<typeof useGetLoginRaccomandataQuery>>(null);

export const GetuseDataConfigRaccomandataProvider: FCC = ({ children }) => {
  
  const query = useGetLoginRaccomandataQuery();

  return (
    <GetRaccomandataConfigContext.Provider value={query}>
      {children}
    </GetRaccomandataConfigContext.Provider>
  );
};

export const useGetQueryRaccomandataConfig = () => useContext(GetRaccomandataConfigContext);
