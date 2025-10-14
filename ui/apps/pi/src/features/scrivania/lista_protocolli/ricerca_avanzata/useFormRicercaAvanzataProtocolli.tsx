import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import {
  MetodoSpedizione,
  RicercaProtocolliDtoInput,
  StatoProtocollo,
  Tag,
  TipoRegistrazione,
  useLazyGetAllTagQuery
} from '@cmrc/services/src/app/piapi/generated';
import { Office, SSOApi as api } from '@cmrc/services/sso';
import { useOffice } from '@cmrc/auth/useOffice';
import { dictionary } from '../dictionary';
import { useTable } from '../../../../store/table/useTable';
import { LabelValue } from '../../../protocollo/protocollo_form/hooks/useProtocolloFormData';

export type RicercaAvanzataForm = RicercaProtocolliDtoInput & {
  advUfficio: LabelValue[];
  advStato: string | string[];
  advMetodoSpedizione: string[];
  advTipoRegistrazione: string[];
  advTag: LabelValue[];
};

const toExcludeStatoProtocollo = [
  'DaPrendereInCarico',
  'Rifiutato',
  'Assegnato',
  'PresoInCarico'
];

export const useFormRicercaAvanzataProtocolli = (
  props: { initialData?: RicercaAvanzataForm } = null
) => {
  const { tableData } = useTable({
    table_id: 'listaProtocolli'
  });

  const { isUserPIAdmin } = useOffice();
  const [getAllTags] = useLazyGetAllTagQuery();
  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();

  const methods = useForm<RicercaAvanzataForm>({
    defaultValues: {
      ...props?.initialData,
      advTag:
        props?.initialData?.advTag !== undefined
          ? props.initialData.advTag
          : undefined,
      advUfficio:
        props?.initialData?.advUfficio !== undefined
          ? props.initialData.advUfficio
          : undefined,
      advStato:
        props?.initialData?.advStato !== undefined
          ? String(props.initialData.advStato).split(',')
          : undefined,
      advMetodoSpedizione:
        props?.initialData?.advMetodoSpedizione !== undefined
          ? String(props.initialData.advMetodoSpedizione).split(',')
          : undefined,
      advTipoRegistrazione:
        props?.initialData?.advTipoRegistrazione !== undefined
          ? String(props.initialData.advTipoRegistrazione).split(',')
          : undefined
    },
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<RicercaAvanzataForm>[] = [
    {
      type: 'select-autocomplete',
      name: 'advUfficio',
      label: dictionary.get('ufficio'),
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
        setValue('advUfficio', value);
      },
      componentProps: {
        multiple: true
      },
      sx:
        isUserPIAdmin && tableData?.filters?.filtro === 'ALL'
          ? { width: { xs: 1, sm: 1 / 1 } }
          : { display: 'none' }
    },
    {
      type: 'text',
      name: 'nProtocollo',
      label: dictionary.get('numero'),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'nProtocolloEmergenza',
      label: dictionary.get('numeroEmergenza'),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'select',
      name: 'advStato',
      label: dictionary.get('stato'),
      componentProps: {
        multiple: true
      },
      options: Object.values(StatoProtocollo)
        .filter((stato) => !toExcludeStatoProtocollo.includes(stato))
        .map((stato) => ({
          label: toSentence(stato),
          value: stato
        })),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'select',
      name: 'advTipoRegistrazione',
      label: dictionary.get('tipoRegistrazione'),
      componentProps: {
        multiple: true
      },
      options: Object.values(TipoRegistrazione).map((tipo) => ({
        label: tipo,
        value: tipo
      })),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'select',
      name: 'advMetodoSpedizione',
      label: dictionary.get('metodoSpedizione'),
      componentProps: {
        multiple: true
      },
      options: Object.values(MetodoSpedizione).map((metodo) => ({
        label: toSentence(metodo),
        value: metodo
      }))
    },
    {
      type: 'text',
      name: 'mittente',
      label: dictionary.get('mittente'),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'destinatari',
      label: dictionary.get('destinatari'),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'assegnatari',
      label: dictionary.get('assegnatari')
    },
    {
      type: 'select-autocomplete',
      name: 'advTag',
      label: dictionary.get('tag'),
      query: (value: string) =>
        getAllTags({
          search: String(value)
        }),
      optionMapping: ({ data: { getAllTag: tags } }) =>
        tags?.map((tag: Tag) => ({
          label: tag?.nome,
          value: tag?.nome
        })) || [],
      onSelect: (value, setValue) => {
        setValue('advTag', value.value);
      },
      componentProps: {
        multiple: true
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'date',
      name: 'dataCreazioneFrom',
      label: dictionary.get('dataProtocolloDa'),
      clearable: true,
      clearText: 'Cancella',
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'date',
      name: 'dataCreazioneTo',
      label: dictionary.get('dataProtocolloA'),
      clearable: true,
      clearText: 'Cancella',
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'date',
      name: 'dataCreazioneEmergenzaFrom',
      label: dictionary.get('dataProtocolloEmergenzaDa'),
      clearable: true,
      clearText: 'Cancella',
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'date',
      name: 'dataCreazioneEmergenzaTo',
      label: dictionary.get('dataProtocolloEmergenzaA'),
      clearable: true,
      clearText: 'Cancella',
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'oggetto',
      label: dictionary.get('oggetto')
    },
    {
      type: 'text',
      name: 'note',
      label: dictionary.get('note')
    }
    // {
    //   type: 'text',
    //   name: 'classificazione',
    //   label: dictionary.get('classificazione'),
    //   sx: { width: { xs: 1, sm: 1 / 1 } }
    // },
    // {
    //   type: 'text',
    //   name: 'protocolloEmergenza',
    //   label: dictionary.get('protocolloEmergenza'),
    //   sx: { width: { xs: 1, sm: 1 / 2 } }
    // },
    // {
    //   type: 'date',
    //   name: 'dataProtocolloEmergenza',
    //   label: dictionary.get('dataProtocolloEmergenza'),
    //   sx: { width: { xs: 1, sm: 1 / 2 } }
    // }
  ];

  return { methods, structure };
};
