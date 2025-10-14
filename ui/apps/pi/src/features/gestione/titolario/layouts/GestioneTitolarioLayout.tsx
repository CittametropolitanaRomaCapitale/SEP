import { useState } from 'react';
import { GetDataTitolarioProvider } from '../../../../hooks/useDataTitolario';
import { RicercaTitolario } from '../../../protocollo/protocollo_form/ricerca_titolario/RicercaTitolario';
import { TitolarioSnackBars } from '../TitolarioSnackBars';
import { GetMaxLivelloFasciolazioneProvider } from '../../../utilità/configurazioni/configurazioni_pec_peo/gestione_livello_fascicolazione/hooks/useGetMaxLivelloFascicolazione';

export const GestioneTitolarioLayout = () => {
  const [idPadre, setIdPadre] = useState();
  const [lastIndex, setLastIndex] = useState(-1);
  const [lastIdTitolario, setLastIdTitolario] = useState(-1);
  const [filtersList, setFiltersList] = useState({
    showFascicoliChiusi: false,
    hideFascicoliDeleted: false,
    showFascicoliForProtocolli: false,
    showFascicoliWithDocumenti: false,
    showFascicoliWithProtocolli: false
  });
  return (
    <GetDataTitolarioProvider
      idPadre={idPadre}
      lastIdTitolario={lastIdTitolario}
      startIndex={lastIndex}
      showFascicoliChiusi
      showFascicoliDeleted
      hideFascicoliDeleted={filtersList.hideFascicoliDeleted}
      showFascicoliForProtocolli
      showFascicoliWithDocumenti={filtersList.showFascicoliWithDocumenti}
      showFascicoliWithProtocolli={filtersList.showFascicoliWithProtocolli}
    >
      <GetMaxLivelloFasciolazioneProvider>
        <RicercaTitolario
          isGestione
          onChangeItem={(item) => {
            setIdPadre(item?.id);
          }}
          setFiltersList={setFiltersList}
          setIndexesForSearch={(lastIdTitolario, startIndex) => {
            setLastIdTitolario(lastIdTitolario);
            setLastIndex(startIndex);
          }}
        />
      </GetMaxLivelloFasciolazioneProvider>
      <TitolarioSnackBars />
    </GetDataTitolarioProvider>
  );
};
