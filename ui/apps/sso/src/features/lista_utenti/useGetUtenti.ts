import { useGetApiAuthUsersQuery, User } from '@cmrc/services/sso';
import { useTable } from '../../store/table/useTable';

export interface Data {
  data: User[];
  pages: number;
}

export const useGetUtenti = () => {
  const { tableData } = useTable({
    table_id: 'listaUtenti'
  });

  const { data, isLoading, isFetching } = useGetApiAuthUsersQuery({
    page: tableData?.page || 0,
    by: tableData?.sort?.by,
    desc: tableData?.sort?.desc,
    search: tableData?.search || undefined,
    appId: tableData?.filters?.advancedFilters?.application?.value || '',
    enabledFlag: tableData?.filters?.enabled || 0,
    roles: tableData?.filters?.advancedFilters?.roles?.map((r) => r?.value) || [],
    types: tableData?.filters?.advancedFilters?.types.map((t) => t?.value) || [],
    officeIds: tableData?.filters?.advancedFilters?.officeIds.map((o) => o?.value) || []
  });

  return {
    data: data as unknown as Data,
    isLoading,
    isFetching
  };
};
