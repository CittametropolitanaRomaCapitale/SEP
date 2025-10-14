import Pagination from '../../../components/Pagination';
import { useGetQueryRegistroGiornalieroList } from './hooks/useDataRegistroGiornalieroList';

export const PaginationRegistroGiornalieroList = () => {
	const { data } = useGetQueryRegistroGiornalieroList();

	return (
		<Pagination
			table_id='registroGiornaliero'
			count={data?.getRegistroGiornaliero?.pageCount}
			size='small'
			siblingCount={0} />
	);
};
