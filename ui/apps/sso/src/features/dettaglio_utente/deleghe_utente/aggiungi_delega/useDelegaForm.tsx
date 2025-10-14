import { useRouter } from 'next/router';
import { SSOApi as api } from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { isDateTimeLowerThan } from '@cmrc/ui/utils/date-utils';
import { useGetUtente } from '../../useGetUtente';
import { dictionary } from '../dictionary';

export const useDelegaForm = ({ userDisabled, methods }) => {
  const { query } = useRouter();
  const { data: userData } = useGetUtente();

  const [triggerUser] = api.endpoints.getApiAuthUsers.useLazyQuery();
  const [triggerApplication] = api.endpoints.getApiApplication.useLazyQuery();
  const [triggerCdr] = api.endpoints.getApiUserById.useLazyQuery();

  const id = methods?.watch('id');
  const delegationStart = methods?.watch('delegation_start');

  const structure: BaseInputProps<any>[] = [
    {
      type: 'select-autocomplete',
      name: 'user',
      required: !userDisabled,
      label: dictionary.get('utente'),
      query: (value) =>
        triggerUser({
          search: value ?? ''
        }),
      optionMapping: ({ data: { data: users } }) =>
        users
          ?.filter((item) => item?.id !== userData?.id)
          ?.map((user) => ({
            label: user?.username,
            value: user?.id
          })),
      onSelect: (value, setValue) => {
        setValue('user_id', value.value);
      },
      componentProps: {
        disabled: userDisabled
      }
    },
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
      name: 'offices',
      required: true,
      label: dictionary.get('cdr'),
      componentProps: {
        multiple: !id
      },
      query: () =>
        triggerCdr({
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
      type: 'date-time',
      name: 'delegation_start',
      label: dictionary.get('dal'),
      required: true
    },
    {
      type: 'date-time',
      name: 'delegation_end',
      label: dictionary.get('al'),
      required: true,
      validation: {
        validate: async (date: Date) => {
          if (
            isDateTimeLowerThan({
              date,
              dateToCompare: delegationStart
            })
          ) {
            return dictionary.get('dataInferioreDataAl');
          }
          return true;
        }
      }
    },
    {
      type: 'text',
      name: 'note',
      required: true,
      label: dictionary.get('note'),
      placeholder: dictionary.get('note'),
      componentProps: {
        multiline: true,
        minRows: 3
      }
    }
  ];

  return { structure };
};
