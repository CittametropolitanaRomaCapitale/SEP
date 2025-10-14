import { SSOApi as api } from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { orderBy } from '../../../../utils';
import { dictionary } from '../dictionary';

export type AdminRole = {
  application?: { label: string; value: number };
  role?: { label: string; value: number };
};

export const useAggiungiRuoloAmministrazioneForm = () => {
  const [triggerApplication] = api.endpoints.getApiApplication.useLazyQuery();
  const [triggerAdminRoles] =
    api.endpoints.getApiAdminRoleApplicationByApplicationId.useLazyQuery();

  const structure: BaseInputProps<AdminRole>[] = [
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
        }))
    },
    {
      type: 'select-autocomplete',
      name: 'role',
      required: true,
      label: dictionary.get('ruolo'),
      query: (value, getValues) => {
        const { application } = getValues();
        return application?.value
          ? triggerAdminRoles({
              applicationId: application?.value
            })
          : null;
      },
      optionMapping: ({ data: roles }) =>
        orderBy({
          array: roles.map((role) => ({
            label: role?.role,
            value: role?.id
          })),
          by: 'label'
        })
    }
  ];

  return { structure };
};
