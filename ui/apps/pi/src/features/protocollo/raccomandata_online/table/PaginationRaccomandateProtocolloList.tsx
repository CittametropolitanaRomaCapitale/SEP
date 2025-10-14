import Pagination from "../../../../components/Pagination";
import { useGetQueryRaccomandateProtocolloList } from "../hooks/useDataRaccomandateProtocollo";

export const PaginationRaccomandateProtocolloList = () => {
	const { data } = useGetQueryRaccomandateProtocolloList()
	return (
		<Pagination
			table_id='raccomandateProtocollo'
			count={data?.cercaRaccomandate.pageCount}
			size='small'
			siblingCount={0} />
	)
}