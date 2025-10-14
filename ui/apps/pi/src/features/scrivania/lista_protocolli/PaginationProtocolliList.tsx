import Pagination from '../../../components/Pagination';
import { useGetQueryProtocolliList } from './hooks/useDataProtocolliList';

export const PaginationProtocolliList = () => {
    const { data } = useGetQueryProtocolliList();

  return (
    <Pagination
      table_id="listaProtocolli"
      count={data?.getProtocolli?.pageCount}
      size='small'
      totalItems={data?.getProtocolli?.totalResults ? data?.getProtocolli?.totalResults + ' risultati totali' : ''}
      siblingCount={0}
    />
  );
};
