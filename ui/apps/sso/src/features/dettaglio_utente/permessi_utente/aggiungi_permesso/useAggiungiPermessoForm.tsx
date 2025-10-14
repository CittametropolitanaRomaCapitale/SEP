import { CreateMultiPermissionBean, SSOApi as api } from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';

import { useRouter } from 'next/router';
import { orderBy } from '../../../../utils';
import { dictionary } from '../dictionary';

export const useAggiungiPermessoForm = () => {
  const { query } = useRouter();

  const [triggerApplication] = api.endpoints.getApiApplication.useLazyQuery();
  const [triggerUser] = api.endpoints.getApiUserById.useLazyQuery();
  const [triggerRoles] =
    api.endpoints.getApiApplicationByApplicationIdFreeRolesForUserAndUserIdByOfficeOfficeId.useLazyQuery();

  const structure: BaseInputProps<
    CreateMultiPermissionBean & { application; office; roles }
  >[] = [
    {
      type: 'select-autocomplete',
      name: 'application',
      required: true,

      label: dictionary.get('applicazione'),
      query: () => triggerApplication(),
      optionMapping: ({ data: applications }) =>
        applications?.map((application) => ({
          label: application.name,
          value: application.id
        })),
      onSelect: (value, setValue) => {
        setValue('application_id', value.value);
      }
    },
    {
      type: 'select-autocomplete',
      name: 'office',
      required: true,
      label: dictionary.get('cdr'),
      query: () =>
        triggerUser({
          id: Number(query?.id)
        }),
      optionMapping: ({ data: user }) =>
        user?.userOfficesForDelegation.map((userOffice) => ({
          label: userOffice?.office?.name,
          value: userOffice?.office?.id
        })),
      onSelect: (value, setValue) => {
        setValue('office_id', value.value);
      }
    },
    {
      type: 'select-autocomplete',
      name: 'roles',
      required: true,
      componentProps: {
        multiple: true
      },
      label: dictionary.get('ruolo'),
      query: (value, getValues) => {
        const [applicationId, officeId] = getValues([
          'application_id',
          'office_id'
        ]);
        return applicationId && officeId
          ? triggerRoles({
              applicationId,
              officeId,
              userId: Number(query.id)
            })
          : null;
      },
      optionMapping: ({ data: roles }) =>
        orderBy({
          array: roles.map((role) => ({
            label: role?.name,
            value: role?.id
          })),
          by: 'label'
        }),
      onSelect: (value, setValue) => {
        setValue('role_id', value.value);
      }
    }
  ];

  return { structure };
};
