import Pagination from "../../../components/Pagination";
import { useGetQueryReferentiProtocollo } from "./hooks/useDataReferentiProtocollo";

export const PaginazioneAssegnatari = () => {
  const { data } = useGetQueryReferentiProtocollo();

  return (
    <Pagination
      table_id="assegnatariList"
      count={data?.getReferenti?.pageCount}
      itemSx={{ color: 'primary.main' }}
    />
  )
};