import { SSOApi as api } from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../../dictionary';

export const useUtenteForm = () => {
  const [triggerUser] = api.endpoints.getApiAuthUsers.useLazyQuery();
  const structure: BaseInputProps<{
    users: { label: string; value: number }[];
  }>[] = [
    {
      type: 'select-autocomplete',
      name: 'users',
      required: true,
      label: dictionary.get('utenti'),
      query: (value) =>
        triggerUser({
          search: value ?? ''
        }),
      optionMapping: ({ data: { data: users } }) =>
        users?.map((user) => ({
          label: user?.username,
          value: user?.id
        })),
      componentProps: {
        multiple: true
      }
    }
  ];

  return { structure };
};
