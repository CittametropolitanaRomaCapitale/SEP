import { Office, useGetApiOfficeQuery } from '@cmrc/services/sso';
import { SIZE } from '../../const';
import { useTable } from '../../store/table/useTable';

export interface Data {
  data: Office[];
  pages: number;
}

export const useGetUffici = () => {
  const { tableData } = useTable({
    table_id: 'listaUffici'
  });

  const DEFAULT_SORT = 'name';
  const { data, isLoading } = useGetApiOfficeQuery({
    page: tableData?.page || 0,
    by: tableData?.sort?.by || DEFAULT_SORT,
    desc: tableData?.sort?.desc,
    search: tableData?.search,
    size: SIZE
  });

  return {
    data: data as unknown as Data,
    isLoading
  };
};
