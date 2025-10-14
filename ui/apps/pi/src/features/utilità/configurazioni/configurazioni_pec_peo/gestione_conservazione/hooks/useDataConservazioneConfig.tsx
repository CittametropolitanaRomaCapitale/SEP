import { createContext, useContext } from 'react';
import { useGetLoginConservazioneQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';

const GetConservazioneConfigContext = createContext<ReturnType<typeof useGetLoginConservazioneQuery>>(null);

export const GetuseDataConservazioneConfigProvider: FCC = ({ children }) => {

  const query = useGetLoginConservazioneQuery();

  return (
    <GetConservazioneConfigContext.Provider value={query}>
      {children}
    </GetConservazioneConfigContext.Provider>
  );
};

export const useGetQueryConservazioneConfig = () => useContext(GetConservazioneConfigContext);
