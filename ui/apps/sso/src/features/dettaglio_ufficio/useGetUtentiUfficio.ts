import { useGetApiOfficeByIdUsersQuery, User } from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { SIZE_UTENTI_UFFICIO } from '../../const';
import { useTable } from '../../store/table/useTable';

export interface Data {
  data: User[];
  pages: number;
}

export const useGetUtentiUfficio = () => {
  const { query } = useRouter();
  const { tableData } = useTable({
    table_id: 'utentiUfficio'
  });

  const { data, isLoading } = useGetApiOfficeByIdUsersQuery({
    id: Number(query?.id),
    page: tableData?.page || 0,
    by: tableData?.sort?.by,
    desc: tableData?.sort?.desc,
    search: tableData?.search,
    size: SIZE_UTENTI_UFFICIO
  });

  return {
    data: data as unknown as Data,
    isLoading
  };
};
