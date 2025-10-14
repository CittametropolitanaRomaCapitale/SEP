import { FCC } from "@cmrc/types/FCC";
import Pagination from "../../../../../../components/Pagination";
import { useGetQueryPermessiFascicolo } from "../../hooks/useDataPermessiFascicolo";

export const PaginationPermessiFascicolo: FCC = () => {
  const { data } = useGetQueryPermessiFascicolo();
  return (
    <Pagination
      table_id='permessiFascicolo'
      count={data?.getPermessiVisibilita?.pageCount}
      size='small'
      siblingCount={0} />
  );
}
