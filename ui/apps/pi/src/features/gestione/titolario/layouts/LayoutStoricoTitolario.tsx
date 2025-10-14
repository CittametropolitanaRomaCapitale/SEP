import { FCC } from "@cmrc/types/FCC";
import { TitolarioOutputDto } from "@cmrc/services/src/app/piapi/generated";
import { TitolarioStoricoList } from "../storico/TitolarioStoricoList";
import { GetDataStoricoTitolarioListProvider } from "../storico/hooks/useDataTitolarioStoricoList";

export type LayoutStoricoTitolarioProps = {
  itemSelected: TitolarioOutputDto;
}

export const LayoutStoricoTitolario: FCC<LayoutStoricoTitolarioProps> = ({ itemSelected }) => (
  <GetDataStoricoTitolarioListProvider idTitolario={itemSelected?.id}>
    <TitolarioStoricoList />
  </GetDataStoricoTitolarioListProvider>
)
