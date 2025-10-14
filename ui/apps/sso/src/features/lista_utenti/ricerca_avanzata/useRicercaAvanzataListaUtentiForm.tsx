import { CreateMultiPermissionBean, SSOApi as api } from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { useForm } from 'react-hook-form';
import { PermitType } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from './dictionary';

export const useRicercaAvanzataListaUtentiForm = (advancedFilters) => {
  const [triggerApplication] = api.endpoints.getApiApplication.useLazyQuery();
  const [triggerRoles] =
    api.endpoints.getApiRoleAppByApplicationId.useLazyQuery();
  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();
  const methods = useForm<any>({
    defaultValues: advancedFilters,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

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
        methods.setValue('roles', []);
        methods.setValue('types', []);
      },
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
        const [applicationId] = getValues(['application_id']);
        return applicationId
          ? triggerRoles({
              applicationId
            })
          : null;
      },
      optionMapping: ({ data: roles }) =>
        roles?.map((role) => ({
          label: role?.name,
          value: role?.id
        })),
      onSelect: (value, setValue) => {
        setValue('role_id', value.value);
      }
    },
    {
      type: 'select-autocomplete',
      name: 'types',
      required: false,
      componentProps: {
        multiple: true
      },
      label: dictionary.get('type'),
      options: Object.values(PermitType)?.map((tipo) => ({
        label: tipo,
        value: tipo
      })),
      onSelect: (value, setValue) => {
        setValue('type', value.value);
      }
    },
    {
      type: 'select-autocomplete',
      name: 'officeIds',
      required: false,
      label: dictionary.get('ufficio'),
      query: (value) => {
        return triggerOffices({
          search: value ?? '',
          by:'name'
        });
      },
      optionMapping: ({ data: { data } }) => {
        return data?.map((office) => ({
          label: office?.name,
          value: office?.id
        }));
      },
      onSelect: (value, setValue) => {
        setValue('officeIds', value.value);
      },
      componentProps: {
        multiple: true
      }
    }
  ];

  return { structure, methods };
};