import { useEffect, useMemo } from 'react';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { useForm } from 'react-hook-form';
import { Office, SSOApi as api } from '@cmrc/services/sso';
import {
  MetodoSpedizione,
  TipoRegistrazione,
  ModelloAutomaticoDto
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { TitolarioProtcolloForm } from '../../../protocollo/protocollo_form/TitolarioProtcolloForm';
import { useOffice } from '@cmrc/auth/useOffice';

export const useModelloAutomaticoConfigForm = (
  props: { initialData?: ModelloAutomaticoDto } = null
) => {
  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();
  const { cdrCode, isUserPIAdmin, isUserArchivista } = useOffice();
  useEffect(() => {
    if (isUserArchivista && !isUserPIAdmin) {
      triggerOffices({
        by: 'name',
        desc: false
      }).then(({ data: { data: officeData } }) => {
        const filteredOffice = Array.isArray(officeData)
          ? officeData
              .filter((office) => !office.deleted && office.code === cdrCode)
              .map((office) => ({
                label: `${office?.name} - ${office?.short_description}`
              }))
          : [];
        methods.setValue('cdr', filteredOffice[0]?.label);
      });
    }
  }, [cdrCode]);

  const initialData: any = useMemo(() => {
    let titolario = null;
    let cdr = null;
    if (
      props?.initialData?.titolario !== undefined &&
      props?.initialData?.titolario !== null
    ) {
      titolario = [
        {
          id: props?.initialData?.titolario.id,
          key: props?.initialData?.titolario.id,
          hierarchyString: props?.initialData?.hierarchyStringTitolario,
          label: props?.initialData?.titolario.nome
        }
      ];
    }
    if (
      props?.initialData?.cdrCode !== undefined &&
      props?.initialData?.cdrCode !== null
    ) {
      cdr = {
        value: props?.initialData?.cdrCode,
        label: props?.initialData?.cdr
      };
    }

    return {
      nomeModello: props?.initialData?.nomeModello,
      oggettoProtocollo: props?.initialData?.oggettoProtocollo,
      tipoRegistrazione: props?.initialData?.tipoRegistrazione,
      metodoSpedizione: props?.initialData?.metodoSpedizione,
      idTitolario: titolario,
      cdr: cdr
    };
  }, [props?.initialData]);

  const methods = useForm<any>({
    defaultValues: initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    methods.clearErrors();
  }, [initialData]);

  const structure: BaseInputProps<ModelloAutomaticoDto>[] = [
    {
      type: 'text',
      name: 'nomeModello',
      label: dictionary.get('nome'),
      title: dictionary.get('nomeTooltip'),
      required: true,
      sx: { width: { xs: 1 } }
    },
    {
      type: 'text',
      name: 'oggettoProtocollo',
      label: dictionary.get('oggetto'),
      title: dictionary.get('oggettoTooltip'),
      required: false,
      sx: { width: { xs: 1 } }
    },
    {
      type: 'select',
      name: 'tipoRegistrazione',
      required: false,
      label: dictionary.get('tipoRegistrazione'),
      title: dictionary.get('tipoRegistrazioneTooltip'),
      options: Object.values(TipoRegistrazione)?.map((tipo) => ({
        label: tipo,
        value: tipo
      })),
      sx: { width: { xs: 1 } }
    },
    {
      type: 'select',
      name: 'metodoSpedizione',
      required: false,
      label: dictionary.get('metodo'),
      title: dictionary.get('metodoTooltip'),
      options: Object.values(MetodoSpedizione)?.map((metodo) => ({
        label: metodo,
        value: metodo
      })),
      sx: { width: { xs: 1 } }
    },
    isUserArchivista && !isUserPIAdmin
      ? {
          type: 'text',
          name: 'cdr',
          required: false,
          disabled: true,
          label: dictionary.get('cdr'),
          componentProps: {
            multiple: false
          },
          sx: { width: { xs: 1 } }
        }
      : {
          type: 'select-autocomplete',
          name: 'cdr',
          required: false,
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
                value: office?.code
              })) || [],
          onSelect: (value, setValue) => {
            setValue('cdr', value);
          },
          componentProps: {
            multiple: false
          },
          sx: { width: { xs: 1 } }
        },
    {
      type: 'custom',
      name: 'titolarioCustom',
      sx: { width: { xs: 1 } },
      render: () => (
        <TitolarioProtcolloForm readMode={true} formMethod={methods} />
      )
    }
  ];

  return { methods, structure };
};
