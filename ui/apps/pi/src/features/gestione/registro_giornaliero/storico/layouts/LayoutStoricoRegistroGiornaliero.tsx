import { FCC } from "@cmrc/types/FCC";
import { RegistroGiornaliero } from "@cmrc/services/src/app/piapi/generated";
import { GetDataStoricoRegistroGiornalieroListProvider } from "../hooks/useDataRegistroGiornalieroStoricoList";
import { RegistroGiornalieroStoricoList } from "../RegistroGiornalieroStoricoList";

export type LayoutStoricoRegistroProtocolloProps = {
  itemSelected: RegistroGiornaliero;
}

export const LayoutStoricoRegistroProtocollo: FCC<LayoutStoricoRegistroProtocolloProps> = ({ itemSelected }) => (
  <GetDataStoricoRegistroGiornalieroListProvider idRegistroGiornaliero={itemSelected?.id}>
    <RegistroGiornalieroStoricoList />
  </GetDataStoricoRegistroGiornalieroListProvider>
)
