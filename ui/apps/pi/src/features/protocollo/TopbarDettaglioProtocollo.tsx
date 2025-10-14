import Grid from '@mui/material/Grid';
import {
  ProtocolloBaseFragment,
  StatoProtocollo
} from '@cmrc/services/src/app/piapi/generated';
import { Rifiuta } from './protocollo_actions/rifiuta_protocollo/buttons/Rifiuta';
import ProtocolloActionsList from './protocollo_actions/ProtocolloActionsList';
import { Assegna } from './protocollo_actions/assegna_protocollo/buttons/Assegna';
import { PrendiInCarico } from './protocollo_actions/prendi_in_carico/buttons/PrendiInCarico';
import { useGetQueryDettaglioProtocollo } from './useDataDettaglioProtocollo';
import { Annullamento } from './protocollo_actions/annulla_protocollo/buttons/Annullamento';
import { GestisciAnnullamento } from './protocollo_actions/gestisci_annullamento/buttons/GestisciAnnullamento';
import { dictionary } from './dictionary';
import { RichiediAssegnazione } from './protocollo_actions/richiedi_assegnazione/buttons/RichiediAssegnazione';
import { FCC } from '@cmrc/types/FCC';

type TopbarDettaglioProtocolloProps = {
  requestStoricoUpdate?: () => void;
};

export const TopbarDettaglioProtocollo: FCC<TopbarDettaglioProtocolloProps> = ({
  requestStoricoUpdate
}) => {
  const { data } = useGetQueryDettaglioProtocollo();
  const protocolloData: ProtocolloBaseFragment =
    data?.dettaglioProtocollo?.protocollo;
  const dettaglioProtocollo = data?.dettaglioProtocollo;

  const statoProtocollo = {
    isPrendiInCarico:
      dettaglioProtocollo?.statoProtocollo ===
      StatoProtocollo.DaPrendereInCarico,
    isPresoInCarico:
      dettaglioProtocollo?.statoProtocollo === StatoProtocollo.PresoInCarico
  };

  const actions = {
    isAssegna: dettaglioProtocollo?.assegna,
    isRifiuta: dettaglioProtocollo?.rifiuta,
    isAnnulla: dettaglioProtocollo?.annulla,
    isRichiestaAnnullamento: dettaglioProtocollo?.richiestaAnnullamento,
    isGestioneAnnullamento: dettaglioProtocollo?.gestioneAnnullamento
  };

  const showRichiediAssegnazione = !dettaglioProtocollo?.authorized;
  const showPrendiInCarico =
    statoProtocollo?.isPrendiInCarico || statoProtocollo?.isPresoInCarico;
  const isAnnullamento = actions?.isRichiestaAnnullamento || actions?.isAnnulla;
  const annullaAction = actions?.isAnnulla
    ? dictionary.get('annulla')
    : dictionary.get('richiestaAnnullamento');

  if (showRichiediAssegnazione) {
    return (
      <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'right' }}>
        <RichiediAssegnazione
          idProtocollo={protocolloData?.id}
          nProtocollo={protocolloData?.nProtocollo}
        />
      </Grid>
    );
  }

  return (
    <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'right' }}>
      {showPrendiInCarico && (
        <PrendiInCarico
          isDisabled={statoProtocollo?.isPresoInCarico}
          protocolloData={protocolloData}
        />
      )}
      <Assegna
        disabledAssegna={!actions?.isAssegna}
        protocolloData={protocolloData}
      />
      <Rifiuta
        isDisabled={!actions?.isRifiuta}
        nProtocollo={protocolloData?.nProtocollo}
      />
      {isAnnullamento && !actions?.isGestioneAnnullamento && (
        <Annullamento
          isDisabled={false}
          action={annullaAction}
          protocolloData={protocolloData}
        />
      )}
      {actions?.isGestioneAnnullamento && (
        <GestisciAnnullamento
          isDisabled={!actions?.isGestioneAnnullamento}
          protocolloData={protocolloData}
        />
      )}
      <ProtocolloActionsList
        protocolloData={protocolloData}
        from="dettaglioProtocollo"
        requestStoricoUpdate={requestStoricoUpdate}
      />
    </Grid>
  );
};
