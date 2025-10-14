import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Protocollo } from '../Protocollo';
import { RiepilogoProtocollo } from '../RiepilogoProtocollo';
import { DettaglioProtocolloSkeleton } from '../../../components/DettaglioProtocolloSkeleton';
import { TopbarDettaglioProtocollo } from '../TopbarDettaglioProtocollo';
import { Storico } from '../storicizzazione/Storico';
import { Raccomandata } from '../raccomandata_online/Raccomandata';
import { Assegnatari } from '../assegnatari/Assegnatari';
import { useGetQueryReferentiProtocollo } from '../assegnatari/hooks/useDataReferentiProtocollo';
import { GetDataAllegatiProtocolloProvider } from '../hooks/useDataAllegatiProtocollo';
import { Cestino } from '../cestino/Cestino';
import { useResumeAllegatoMutation } from '@cmrc/services/src/app/piapi/generated';
import { useGetAllegatiDiscardedListQuery } from '../hooks/useGetAllegatiDiscarded';
import toast from '@cmrc/ui/components/Toast';
import { useGetQueryStoricoList } from '../storicizzazione/hooks/useDataStoricoList';
import { dictionary } from '../cestino/dictionary';
import { useGetQueryDettaglioProtocollo } from '../useDataDettaglioProtocollo';
import { FCC } from '@cmrc/types/FCC';

type DettaglioProtocolloLayoutProps = {
  onFilterChange: (value: boolean) => void;
  isFilteredByCdr: boolean;
};

export const DettaglioProtocolloLayout: FCC<DettaglioProtocolloLayoutProps> = ({
  onFilterChange,
  isFilteredByCdr
}) => {
  const router = useRouter();
  const queryStorico = useGetQueryStoricoList();
  const { data, isLoading: isLoadingDettaglio } =
    useGetQueryDettaglioProtocollo();
  const idProtocollo = data?.dettaglioProtocollo?.protocollo?.id;
  const { isLoading: isloadingReferenti } = useGetQueryReferentiProtocollo();
  const [resumeAllegatoMutation] = useResumeAllegatoMutation();
  const allegatiDiscarded = useGetAllegatiDiscardedListQuery();
  const discardedAllegati =
    allegatiDiscarded?.data?.getAllegatiDiscarded?.allegati;
  const [resumedAllegati, setResumedAllegati] = useState([]);
  const [mustShowRichiestaAssegnazione, setMustShowRichiestaAssegnazione] =
    useState(false);

  const handleStoricoUpdate = () => {
    queryStorico.refetch();
  };

  useEffect(() => {
    if (
      !isLoadingDettaglio &&
      !isloadingReferenti &&
      data &&
      !data.dettaglioProtocollo.authorized
    ) {
      //router.push('/unauthorized');
      setMustShowRichiestaAssegnazione(true);
    }
  }, [data, isLoadingDettaglio, isloadingReferenti, router]);

  const isUnauthorized = useMemo(
    () =>
      isLoadingDettaglio ||
      isloadingReferenti ||
      !data ||
      !data.dettaglioProtocollo.authorized,
    [isLoadingDettaglio, isloadingReferenti, data]
  );
  const handleResumeFile = async (fileToResume) => {
    const idAllegato = fileToResume?.id;
    try {
      const response = await resumeAllegatoMutation({
        idAllegato: idAllegato
      }).unwrap();
      if (response?.resumeAllegato) {
        allegatiDiscarded?.refetch();
        queryStorico.refetch();
        toast.success(dictionary.get('allegatoRipristinato'));
        setResumedAllegati(fileToResume);
      }
    } catch (e) {
      toast.error(dictionary.get('allegatoNonRipristinato'));
    }
  };

  /* nel dettaglio, in caso di richiesta di assegnazione,
    si toglie 
    <Assegnatari />
    <Raccomandata /> 
    <Storico />
    <Cestino
      onHandleResumeFile={handleResumeFile}
      discardedAllegati={discardedAllegati}
    />
  */
  return mustShowRichiestaAssegnazione ? (
    <DettaglioProtocolloSkeleton>
      <GetDataAllegatiProtocolloProvider idProtocollo={idProtocollo}>
        <TopbarDettaglioProtocollo requestStoricoUpdate={handleStoricoUpdate} />
        <RiepilogoProtocollo />
        <Protocollo
          readMode
          resumedAllegati={resumedAllegati}
          hideAllegatiSection={true}
        />
        <Protocollo
          readMode
          resumedAllegati={resumedAllegati}
          hideAllegatiSection={true}
        />
      </GetDataAllegatiProtocolloProvider>
    </DettaglioProtocolloSkeleton>
  ) : isUnauthorized ? (
    <DettaglioProtocolloSkeleton />
  ) : (
    <DettaglioProtocolloSkeleton>
      <GetDataAllegatiProtocolloProvider
        idProtocollo={data?.dettaglioProtocollo?.protocollo?.id}
      >
        <TopbarDettaglioProtocollo requestStoricoUpdate={handleStoricoUpdate} />
        <RiepilogoProtocollo />
        <Assegnatari />
        <Protocollo readMode resumedAllegati={resumedAllegati} />
        <Raccomandata />
        <Storico
          idProtocollo={data?.dettaglioProtocollo?.protocollo?.id}
          onFilterChange={onFilterChange}
          isFilteredByCdr={isFilteredByCdr}
        />
        <Cestino
          onHandleResumeFile={handleResumeFile}
          discardedAllegati={discardedAllegati}
        />
      </GetDataAllegatiProtocolloProvider>
    </DettaglioProtocolloSkeleton>
  );
};
