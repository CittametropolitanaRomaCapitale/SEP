import Chip from '@mui/material/Chip';
import orderBy from 'lodash/orderBy';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { useRole } from '@cmrc/ui/utils/role-utils';

export const useAssegnato = () => {
  const { user } = useAuth();

  const offices = orderBy(
    [
      ...(useRole(
        ['RUF_admin', 'RUF_team', 'RUF_assegnatario'],
        ['ruf_admin_resource']
      )
        ? [
            {
              label: 'Team',
              value: '99999998'
            }
          ]
        : []),

      ...(useRole(
        ['RUF_admin', 'RUF_economo', 'RUF_assegnatario'],
        ['ruf_admin_resource']
      )
        ? [
            {
              label: 'Economo',
              value: '99999999'
            }
          ]
        : []),
      ...(user?.offices?.map((item) => ({
        label: item?.office?.name,
        value: item?.office?.code
      })) || [])
    ],
    'label'
  );

  const roleOffices = orderBy(
    [
      ...(useRole(['RUF_admin', 'RUF_team'], ['ruf_admin_resource'])
        ? [
            {
              label: 'Team',
              value: '99999998'
            }
          ]
        : []),

      ...(useRole(['RUF_admin', 'RUF_economo'], ['ruf_admin_resource'])
        ? [
            {
              label: 'Economo',
              value: '99999999'
            }
          ]
        : [])
    ],
    'label'
  );

  const storicOffices =
    user?.storicOffices?.map((item) => ({
      label: (
        <>
          {item?.name}
          {item?.deleted && !item?.deleted_permanent && (
            <Chip
              label="Chiuso"
              size="small"
              variant="filled"
              color="error"
              sx={{ ml: 1 }}
            />
          )}
        </>
      ),
      value: item?.code
    })) || [];

  const getAssegnato = (cdrCode: string | number, otherOffices: any[] = []) =>
    cdrCode
      ? [...offices, ...otherOffices]?.find(
          (item) => Number(item?.value) === Number(cdrCode)
        )?.label
      : undefined;

  return {
    offices,
    roleOffices,
    storicOffices,
    getAssegnato
  };
};
