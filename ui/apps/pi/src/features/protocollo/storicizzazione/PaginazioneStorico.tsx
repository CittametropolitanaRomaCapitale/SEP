import Pagination from "../../../components/Pagination";
import { useGetQueryStoricoList } from "./hooks/useDataStoricoList";

export const PaginazioneStorico = () => {
  const { data } = useGetQueryStoricoList();

  return (
    <Pagination
      table_id="storicoProtocollo"
      count={data?.getStoricoProtocollo?.pageCount}
      itemSx={{ color: 'primary.main' }}
    />
  )
};