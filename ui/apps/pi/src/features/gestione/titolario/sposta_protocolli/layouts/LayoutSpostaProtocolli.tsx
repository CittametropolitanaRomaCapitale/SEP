import { useState } from "react";
import { FCC } from "@cmrc/types/FCC"
import { ProtocolloBaseFragment, TitolarioOutputDto } from "@cmrc/services/src/app/piapi/generated";
import { ListaProtocolliFascicolo } from "../ListaProtocolliFascicolo";
import { GetDataProtocolliTitolarioProvider } from "../hooks/useDataProtocolliTitolario";
import { TopbarProtocolliFascicolo } from "../TopbarProtocolliFascicolo";

export type LayoutSpostaProtocolliProps = {
  itemSelected: TitolarioOutputDto;
}

export const LayoutSpostaProtocolli: FCC<LayoutSpostaProtocolliProps> = ({itemSelected}) => {
  const [selectedProtocolli, setSelectedProtocolli] = useState<ProtocolloBaseFragment[]>([]);

  return (
    <GetDataProtocolliTitolarioProvider itemSelected={itemSelected}  >
      <TopbarProtocolliFascicolo itemSelected={itemSelected} selectedProtocolli={selectedProtocolli} disabled={itemSelected.immutable || (!itemSelected.write)} />
      <ListaProtocolliFascicolo setSelectedProtocolli={setSelectedProtocolli} selectEnabled={itemSelected.write} />
    </GetDataProtocolliTitolarioProvider >
  )
}