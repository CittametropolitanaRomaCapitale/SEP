import Pagination from "../../../../components/Pagination";
import { useGetQueryStoricoList } from "./hooks/useDataTitolarioStoricoList";

export const PaginazioneTitolarioStorico = () => {
  const { data } = useGetQueryStoricoList();
  return (
    <Pagination
      table_id="storicoTitolario"
      count={data?.getStoricoTitolario?.pageCount}
      itemSx={{ color: 'primary.main' }}
    />
  )
};