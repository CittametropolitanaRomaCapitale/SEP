import { SSOApi as api } from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { useRouter } from 'next/router';
import { dictionary } from '../../dictionary';

export const useSpostaUtentiForm = () => {
  const { query } = useRouter();

  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();

  const structure: BaseInputProps<any>[] = [
    {
      type: 'select-autocomplete',
      name: 'offices',
      required: true,
      label: dictionary.get('uffici'),
      componentProps: {
        multiple: true
      },
      query: (value) =>
        triggerOffices({
          search: value,
          by: 'name',
          desc: false
        }),
      optionMapping: ({ data: { data: offices } }) =>
        offices
          ?.filter((office) => office.id !== Number(query?.id))
          .filter((office) => !office.deleted)
          .map((office) => ({
            label: office.name,
            value: office.id
          }))
    },
    {
      type: 'checkbox',
      name: 'mantieni',
      label: dictionary.get('mantieniUtenti'),
      required: false
    }
  ];

  return { structure };
};
