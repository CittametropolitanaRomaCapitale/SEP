import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { BaseInputProps } from "@cmrc/ui/form/FormGenerator/core/types";
import { Office, SSOApi as api } from "@cmrc/services/sso";
import { VisibilitaTitolario, VisibilitaTitolarioInputInput } from "@cmrc/services/src/app/piapi/generated";
import { dictionary } from "../../dictionary";
import { useGetQueryPermessiFascicolo } from "../../../../hooks/useDataPermessiFascicolo";

export type AggiungiPermessi = VisibilitaTitolarioInputInput & {
  cdr: {
    label: string,
    value: {
      name: string;
      description: string;
      code: string;
    }
  };
}

export const useAggiungiPermessiForm = () => {
  const { data: permessiList } = useGetQueryPermessiFascicolo();
  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();
  const [userListQuery] = api.endpoints.getApiOfficeByOfficeIdApplicationAndApplicationIdUsers.useLazyQuery();

  const utentiAssegnati: { username: string; cdrCode: string }[] = useMemo(() =>
      permessiList?.getPermessiVisibilita?.permessi?.map((permesso: VisibilitaTitolario) => ({
        username: permesso.usernameUtente,
        cdrCode: permesso.cdrCode,
      })) || [],
    [permessiList?.getPermessiVisibilita?.permessi]
  );

  const methods = useForm<any>({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<AggiungiPermessi>[] = [
    {
      type: 'select',
      name: 'permesso',
      label: dictionary.get('permesso'),
      required: true,
      options: [
        { label: dictionary.get('lettura'), value: dictionary.get('lettura') },
        { label: dictionary.get('scrittura'), value: dictionary.get('scrittura') }
      ],
      onChange: () => {
        methods.setValue('utenti', []);
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'select-autocomplete',
      name: 'cdr',
      required: true,
      label: dictionary.get('cdr'),
      query: (value) =>
        triggerOffices({
          search: value,
          by: 'name',
          desc: false
        }),
      optionMapping: ({ data: { data: offices } }) =>
        offices
          ?.filter((office) => !office.deleted)
          .map((office: Office) => ({
            label: `${office?.name} - ${office?.short_description}`,
            value: {
              id: office?.id,
              name: office?.name,
              description: office?.short_description,
              code: office?.code
            }
          })) || [],
      onSelect: (value, setValue) => {
        setValue('cdr', value);
        methods.setValue('utenti', []);
      },
      componentProps: {
        multiple: false
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'select-autocomplete',
      name: 'utenti',
      required: false,
      label: dictionary.get('utenti'),
      query: (value) =>
        userListQuery({
          applicationId: 3,
          officeId: methods.getValues('cdr').value.id,
          search: value ?? '',
          size: 50
        }),
      optionMapping: ({ data }) => {
        const permessoScrittura = methods.watch('permesso') === dictionary.get('scrittura');
        const filteredData = data?.data.filter(user => {
          const isArchivist = permessoScrittura ? user.roles.includes('archivista') : true;
          const isAlreadyAssigned = utentiAssegnati.some((assegnato) => 
            assegnato.username === user.username && assegnato.cdrCode === methods.getValues('cdr').value?.code
          );          
          return !isAlreadyAssigned && isArchivist;
        });
      
        const mappedData = filteredData.map((user) => ({
            label:`${user.username} - (${user.roles.join(', ')})`,
            value: user.auth_id
          }));
      
        return mappedData || [];
      },
      
      onSelect: (value, setValue) => {
        setValue('utenti', value.value);
      },
      componentProps: {
        multiple: true
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'text',
      name: 'note',
      label: dictionary.get('note'),
      componentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 5,
        maxLength: 499
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    }
  ];

  return { methods, structure }
}