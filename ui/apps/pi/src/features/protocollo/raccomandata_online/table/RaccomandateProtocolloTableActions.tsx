import { FCC } from '@cmrc/types/FCC';
import { RaccomandataBaseFragment, StatoRaccomandataProtocollo } from '@cmrc/services/src/app/piapi/generated';
import { useEffect, useState } from 'react';
import { AnnullaRaccomandataButton } from './button/AnnullaRaccomandataButton';
import { useGetQueryRaccomandateProtocolloList } from '../hooks/useDataRaccomandateProtocollo';

export const RaccomandateProtocolloTableActions: FCC<{ raccomandata?: RaccomandataBaseFragment }> = ({
  raccomandata
}) => {

  const [hideAnnulla, setHideAnnulla] = useState(true)
  const { refetch } = useGetQueryRaccomandateProtocolloList();

  const getAnnullaButton = () => {
    const creationDate: any = new Date(raccomandata?.tsCreation);
    const currentTime: any = new Date()
    const timeDifference = currentTime - creationDate;

    const fiveMinutesInMs = 5 * 60 * 1000; // 5 minuti in millisecondi

    // annulla disponibile per le raccomandate con stato INCODA e con tempo trascorso inferiore a 5 min dalla creazione
    if (raccomandata?.stato === StatoRaccomandataProtocollo.InCoda && timeDifference <= fiveMinutesInMs) {
      setHideAnnulla(false);
    }

    else
      setHideAnnulla(true);
  }

  useEffect(() => {
    getAnnullaButton();
  }, [refetch])

  return (
    <AnnullaRaccomandataButton raccomandata={raccomandata} hidden={hideAnnulla} />
  );
}