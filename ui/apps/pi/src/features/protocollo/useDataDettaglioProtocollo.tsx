import { createContext, useContext, useEffect } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { useDettaglioProtocolloQuery } from '@cmrc/services/src/app/piapi/generated';
import { useOffice } from '@cmrc/auth/useOffice';
import { useRouter } from 'next/router';

const GetDataDettaglioProtocolloContext = createContext<ReturnType<typeof useDettaglioProtocolloQuery>>(null);

export const GetDataDettaglioProtocolloProvider: FCC<{ nProtocollo: string }> = ({
  nProtocollo,
  children
}) => {
  const router = useRouter();
  const { cdrCode } = useOffice();

  const query = useDettaglioProtocolloQuery({
    nProtocollo,
    selectedOffice: cdrCode
  },
    {
      skip: !nProtocollo
    });

  useEffect(() => {
    if (query.error) {
      router.replace('/404');
    }
  }, [query.error, router]);

  if (query.error) {
    return null;
  }

  return (
    <GetDataDettaglioProtocolloContext.Provider value={query}>
      {children}
    </GetDataDettaglioProtocolloContext.Provider>
  );
};

export const useGetQueryDettaglioProtocollo = () =>
  useContext(GetDataDettaglioProtocolloContext);
