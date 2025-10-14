import { FCC } from '@cmrc/types/FCC';
import { useRole } from '../../utils/role-utils';

export interface CanRoleProps {
  roleIds: string[];
  resourceIds: string[];
}

const CanRole: FCC<CanRoleProps> = ({ children, roleIds, resourceIds }) => {
  return <>{useRole(roleIds, resourceIds) && children}</>;
};

export default CanRole;
