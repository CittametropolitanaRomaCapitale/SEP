import {
  AdminApplicationRole,
  useGetApiAdminRoleUserByUserIdQuery
} from '@cmrc/services/sso';
import { useRouter } from 'next/router';
import { useTable } from '../../../store/table/useTable';

export const useGetRuoliAmministrazione = () => {
  const { query } = useRouter();
  const { tableData } = useTable({
    table_id: 'ruoliAmministrazione'
  });

  const { data, isLoading } = useGetApiAdminRoleUserByUserIdQuery({
    userId: Number(query?.id),
    applicationId: tableData?.filters?.applicationId
  });

  return {
    data: data as unknown as AdminApplicationRole[],
    isLoading
  };
};
