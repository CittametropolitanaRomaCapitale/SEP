import Pagination from "../../../../components/Pagination";
import { useGetQueryStoricoList } from "./hooks/useDataRegistroGiornalieroStoricoList";

export const PaginationRegistroGiornalieroStorico = () => {
  const { data } = useGetQueryStoricoList();
  return (
    <Pagination
      table_id="storicoRegistroGiornaliero"
      count={data?.getStoricoRegistroGiornaliero?.pageCount}
      itemSx={{ color: 'primary.main' }}
    />
  )
};