import Pagination from "../../../../components/Pagination";
import { useGetReferentiList } from "../../../../hooks/useDataReferenti";

export const PaginationRicercaReferenti = () => {
  const { data } = useGetReferentiList();
	
  return (
		<Pagination
			table_id='ricercaReferenti'
			count={data?.findReferenti?.pageCount}
			size='small'
			siblingCount={0} />
	);
};
