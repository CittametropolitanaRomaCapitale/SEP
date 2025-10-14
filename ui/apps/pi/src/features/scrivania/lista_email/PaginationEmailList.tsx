import Pagination from '../../../components/Pagination';
import { useGetQueryEmailList } from './hooks/useDataEmailList';

export const PaginationEmailList = () => {
  const { data } = useGetQueryEmailList();
  return (
    <Pagination
      table_id="listaEmail"
      count={data?.getEmails?.pageCount}
      size='small'
      totalItems={data?.getEmails?.totalResults ? data?.getEmails?.totalResults + ' risultati totali' : ''}
      siblingCount={0}
    />
  );
};
