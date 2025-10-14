import uniqBy from 'lodash/uniqBy';
import { usePermission } from '@4dd/authz';
import { useAuth } from '../hooks/use-auth';

export const useRole = (roleIds: string[], resourceIds: string[]) => {
  const { user } = useAuth();

  const roles =
    user?.selectedOffice?.office?.name === 'ALL'
      ? uniqBy(user?.offices?.map((item) => item?.roles)?.flat(), 'id')
      : user?.selectedOffice?.roles;

  return (
    usePermission(resourceIds) ||
    !!roles?.find((item) => roleIds.find((role) => role === item?.full_name))
      ?.full_name
  );
};
