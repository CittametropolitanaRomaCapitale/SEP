import { useRouter } from 'next/router';
import { DettaglioProtocolloLayout } from './DettaglioProtocolloLayout';
import { GetDataReferentiProtocolloProvider } from '../assegnatari/hooks/useDataReferentiProtocollo';
import { GetDataAllegatiDiscardedProvider } from '../hooks/useGetAllegatiDiscarded';
import { useGetQueryDettaglioProtocollo } from '../useDataDettaglioProtocollo';
import { GetDataStoricoListProvider } from '../storicizzazione/hooks/useDataStoricoList';
import { useOffice } from '@cmrc/auth/useOffice';
import { useState } from 'react';

export const DettaglioProtocolloWrapper = () => {
  const [isFilteredByCdr, setIsFilteredByCdr] = useState(false);
  const { query } = useRouter();
  const { data } = useGetQueryDettaglioProtocollo();
  const { cdrCode } = useOffice();
  const idProtocollo = data?.dettaglioProtocollo?.protocollo?.id;
  return (
    <GetDataReferentiProtocolloProvider nProtocollo={String(query.nProtocollo)}>
      <GetDataAllegatiDiscardedProvider idProtocollo={idProtocollo}>
        <GetDataStoricoListProvider
          idProtocollo={idProtocollo}
          cdrCode={cdrCode}
          isFilteredByCdr={isFilteredByCdr}
        >
          <DettaglioProtocolloLayout
            onFilterChange={setIsFilteredByCdr}
            isFilteredByCdr={isFilteredByCdr}
          />
        </GetDataStoricoListProvider>
      </GetDataAllegatiDiscardedProvider>
    </GetDataReferentiProtocolloProvider>
  );
};
