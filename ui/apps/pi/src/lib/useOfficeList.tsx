import orderBy from 'lodash/orderBy';
import { StatoDocumento } from '@cmrc/services/src/app/rufapi/generated';

export const useOfficeList = () => {
  const getAssignableOffices = (status?: string, offices?: any[]) =>
    status === StatoDocumento.ErrataAssegnazione
      ? [
          {
            label: 'Team',
            value: '99999998'
          }
        ]
      : orderBy(
          [
            {
              label: 'Economo',
              value: '99999999'
            },
            ...(offices?.map((office) => ({
              label: office?.name,
              value: office?.code
            })) || [])
          ],
          'label'
        );

  return {
    getAssignableOffices
  };
};
