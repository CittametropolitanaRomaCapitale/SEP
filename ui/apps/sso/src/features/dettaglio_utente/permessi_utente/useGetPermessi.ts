import {
  Permit,
  useGetApiUserByUserIdPermissionsQuery
} from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { SIZE } from '../../../const';
import { useTable } from '../../../store/table/useTable';

export interface Data {
  data: Permit[];
  pages: number;
}

export const useGetPermessi = () => {
  const { query } = useRouter();
  const { tableData } = useTable({
    table_id: 'permessiUtente'
  });

  const { data, isLoading } = useGetApiUserByUserIdPermissionsQuery({
    userId: Number(query?.id),
    page: tableData?.page || 0,
    by: tableData?.sort?.by,
    desc: tableData?.sort?.desc,
    search: tableData?.search || undefined,
    size: SIZE,
    applicationId: tableData?.filters?.applicationId,
    roleIds:
      tableData?.filters?.roleIds && tableData?.filters?.roleIds.length
        ? tableData?.filters?.roleIds
        : undefined,
    cdrs:
      tableData?.filters?.cdrs && tableData?.filters?.cdrs.length
        ? tableData?.filters?.cdrs
        : undefined
  });

  return {
    data: data as unknown as Data,
    isLoading
  };
};
