import {
  Delegation,
  useGetApiUserByUserIdDelegationsQuery
} from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { SIZE } from '../../../const';
import { useTable } from '../../../store/table/useTable';

export interface Data {
  data: Delegation[];
  pages: number;
}

export const useGetDelegheRicevute = () => {
  const { query } = useRouter();
  const { tableData } = useTable({
    table_id: 'riceviDeleghe'
  });

  const { data, isLoading } = useGetApiUserByUserIdDelegationsQuery({
    userId: Number(query?.id),
    page: tableData?.page || 0,
    by: tableData?.sort?.by,
    desc: tableData?.sort?.desc,
    search: tableData?.search || undefined,
    size: SIZE
  });

  return {
    data: data as unknown as Data,
    isLoading
  };
};
