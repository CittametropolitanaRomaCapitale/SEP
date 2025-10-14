import { createContext, useContext } from 'react';
import { useGetPecRegoleQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';

type GetPecRegoleProviderProps = {
  idEmail: number;
};

const GetPecRegoleProviderContext =
  createContext<ReturnType<typeof useGetPecRegoleQuery>>(null);

export const GetPecRegoleProvider: FCC<GetPecRegoleProviderProps> = ({
  idEmail,
  children
}) => {
  const query = useGetPecRegoleQuery({
    idEmail: idEmail
  });

  return (
    <GetPecRegoleProviderContext.Provider value={query}>
      {children}
    </GetPecRegoleProviderContext.Provider>
  );
};

export const useGetQueryPecRegole = () =>
  useContext(GetPecRegoleProviderContext);
