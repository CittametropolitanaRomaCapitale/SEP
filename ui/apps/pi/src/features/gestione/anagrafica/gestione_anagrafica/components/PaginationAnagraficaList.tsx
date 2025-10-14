import Pagination from '../../../../../components/Pagination';
import { useGetQueryAnagraficaList } from '../hooks/useDataAnagraficaList';

export const PaginationAnagraficaList = () => {
	const { data } = useGetQueryAnagraficaList();

	return (
		<Pagination
			table_id='anagrafica'
			count={data?.getAllAnagrafica?.pageCount}
			size='small'
			siblingCount={0} />
	);
};
