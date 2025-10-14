import Pagination from '../../../../../../components/Pagination';
import { useGetQueryGruppiList } from '../hooks/useDataGruppiList';

export const PaginationGruppiList = () => {
	const { data } = useGetQueryGruppiList();

	return (
		<Pagination
			table_id='gruppi'
			count={data?.getAllGruppi?.pageCount}
			size='small'
			siblingCount={0} />
	);
};
