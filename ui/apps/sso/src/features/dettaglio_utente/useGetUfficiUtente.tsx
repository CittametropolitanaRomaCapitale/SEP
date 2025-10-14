import { useRouter } from 'next/router';
import { useGetApiUserByIdOfficesQuery } from '@cmrc/services/sso';
import { useTable } from '../../store/table/useTable';
import { SIZE } from '../../const';
import { UserOffice } from '../../types';

export interface Data {
  data: UserOffice[];
  pages: number;
}

export const useGetUfficiUtente = () => {
  const { query } = useRouter();
  const { tableData } = useTable({
    table_id: 'ufficiUtente'
  });

  const { data, isLoading } = useGetApiUserByIdOfficesQuery({
    id: Number(query?.id),
    page: tableData?.page,
    search: tableData?.search || undefined,
    by: tableData?.sort?.by,
    desc: tableData?.sort?.desc,
    size: SIZE
  });

  return {
    data: data as unknown as Data,
    isLoading
  };
};
