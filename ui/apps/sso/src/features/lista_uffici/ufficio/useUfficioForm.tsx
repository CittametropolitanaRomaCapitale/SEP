import { useRouter } from 'next/router';
import {
  Office,
  OfficeInput,
  SSOApi as api,
  useGetApiOfficeByIdQuery
} from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { SIZE } from '../../../const';
import { dictionary } from '../dictionary';

export const useUfficioForm = () => {
  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();
  const { query } = useRouter();
  const { data: officeData } = useGetApiOfficeByIdQuery(
    {
      id: Number(query?.id)
    },
    {
      skip: !query?.id
    }
  );

  const structure: BaseInputProps<OfficeInput & { apri_subito }>[] = [
    {
      type: 'text',
      name: 'name',
      required: true,
      label: dictionary.get('name'),
      placeholder: dictionary.get('name')
    },
    {
      type: 'text',
      name: 'code',
      required: true,
      label: dictionary.get('code'),
      placeholder: dictionary.get('code')
    },
    {
      type: 'text',
      name: 'description',
      required: true,
      label: dictionary.get('description'),
      placeholder: dictionary.get('description'),
      componentProps: {
        multiline: true,
        minRows: 3
      }
    },
    {
      type: 'text',
      name: 'service',
      required: true,
      label: dictionary.get('service'),
      placeholder: dictionary.get('service'),
      componentProps: {
        multiline: true,
        minRows: 3
      }
    },
    {
      type: 'select-autocomplete',
      name: 'belonging_offices',
      label: dictionary.get('ufficiAppartenenza'),
      componentProps: {
        multiple: true
      },
      query: (value) => triggerOffices({ search: value, page: 0, size: SIZE }),
      optionMapping: ({ data: offices }) =>
        offices?.data
          ?.filter((item) => officeData?.id !== item?.id)
          .map((office: Office) => ({
            label: office?.name,
            value: office?.id
          }))
    }
    /* {
      type: 'checkbox',
      name: 'apri_subito',
      label: dictionary.get('apriSubito'),
      sx: { pt: '0 !important', width: 1 }
    } */
  ];

  return { structure };
};
