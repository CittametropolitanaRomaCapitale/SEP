import { createContext, useContext } from 'react';
import { useGetMaxLivelloFascicolazioneForTitolarioQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';

const GetMaxLivelloFasciolazioneContext =
  createContext<
    ReturnType<typeof useGetMaxLivelloFascicolazioneForTitolarioQuery>
  >(null);

export const GetMaxLivelloFasciolazioneProvider: FCC = ({ children }) => {
  const query = useGetMaxLivelloFascicolazioneForTitolarioQuery();

  return (
    <GetMaxLivelloFasciolazioneContext.Provider value={query}>
      {children}
    </GetMaxLivelloFasciolazioneContext.Provider>
  );
};

export const useGetMaxLivelloFascicolazione = () =>
  useContext(GetMaxLivelloFasciolazioneContext);
