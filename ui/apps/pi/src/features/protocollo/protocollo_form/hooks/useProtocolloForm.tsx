import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  isAlphaNumericDash,
  isOverLength
} from '@cmrc/ui/utils/validator-utils';
import {
  MetodoSpedizione,
  Tag,
  TipoRegistrazione,
  useLazyGetAllTagQuery,
  ProtocolloInputInput
} from '@cmrc/services/src/app/piapi/generated';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { useOffice } from '@cmrc/auth/useOffice';
import { useProtocolloService } from './useProtocolloService';
import { LabelValue } from './useProtocolloFormData';
import { SearchProtocolli } from '../../../../components/SearchProtocolli/SearchProtocolli';
import { configurazioniFormProtocollo } from '../../../../hooks/useConfigurazioniFormProtocollo';
import {
  clearEmailData,
  clearInoltraRispondiConProtocollo
} from '../../../../store/email/emailSlice';
import { useDispatch } from '../../../../store';
import { DestinatariProtocolloForm } from '../DestinatariProtocolloForm';
import { dictionary } from '../../dictionary';
import { MittenteProtocolloForm } from '../MittenteProtocolloForm';
import { TitolarioProtcolloForm } from '../TitolarioProtcolloForm';
import { resetState } from '../../../../store/protocollo/protocolloSlice';

export type ProtocolloForm = ProtocolloInputInput & {
  flagTag: boolean;
  destinatariCompetenza: LabelValue[];
  destinatariConoscenza: LabelValue[];
  formTagList: Array<{ label: string; value: Tag }>;
};

export const useProtocolloForm = (defaultValues, readMode, pecAction) => {
  const [metodiSpedizione, setMetodiSpedizione] =
    useState<MetodoSpedizione[]>();
  const [isPecPeo, setIsPecPeo] = useState(false);
  const [openProtocolloCircolare, setOpenProtocolloCircolare] = useState(false);
  const { maxLengthProtocolloOggetto } = configurazioniFormProtocollo();
  const [pecPeoOptions, setPecPeoOptions] = useState<LabelValue[]>();
  const [getAllTags] = useLazyGetAllTagQuery();
  const dispatch = useDispatch();
  const { getMetododiSpedizioneList, pecPeoSelected, getPecPeoList } =
    useProtocolloService();
  // const [valoriDefault, setValoriDefault] =
  //   useState<ProtocolloForm>(defaultValues);
  const methods = useForm<ProtocolloForm>({
    defaultValues,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });
  const { cdr, shortCdrDesc, cdrCode } = useOffice();
  const tipoRegistrazioneSel = methods.watch('tipoRegistrazione');
  const metodoSpedizioneValue = methods.watch('metodoSpedizione');
  const isFlagTag = methods.watch('flagTag');
  const isRegistrazioneUscita =
    tipoRegistrazioneSel === TipoRegistrazione.Uscita;
  const isRegistrazioneEntrata =
    tipoRegistrazioneSel === TipoRegistrazione.Entrata;
  const isTipoRegistrazioneInterno =
    tipoRegistrazioneSel === TipoRegistrazione.Interno;
  const isTipoRegistrazioneCircolare =
    tipoRegistrazioneSel === TipoRegistrazione.Circolare;

  useEffect(() => {
    const fetchData = async () => {
      if (!readMode && tipoRegistrazioneSel) {
        // se seleziono uscita, interno o circolare il mittente è l'ufficio selezionato
        if (
          isRegistrazioneUscita ||
          isTipoRegistrazioneInterno ||
          isTipoRegistrazioneCircolare
        ) {
          const mittente: any = {
            tipo: 'ufficio',
            idMittente: cdrCode,
            label: `${cdr} - ${shortCdrDesc}`
          };
          methods.setValue('mittente', mittente);
        }
      }

      setMetodiSpedizione(getMetododiSpedizioneList(tipoRegistrazioneSel));

      if (metodoSpedizioneValue) {
        setIsPecPeo(pecPeoSelected(metodoSpedizioneValue));

        if (
          tipoRegistrazioneSel === TipoRegistrazione.Uscita &&
          pecPeoSelected(metodoSpedizioneValue)
        ) {
          const options = await getPecPeoList(
            metodoSpedizioneValue,
            readMode,
            methods.getValues('indirizzoPecPeo')
          );
          setPecPeoOptions(options);
        }
      }
      if (isTipoRegistrazioneInterno || isTipoRegistrazioneCircolare) {
        methods.setValue('metodoSpedizione', MetodoSpedizione.Tracciabilita);
      }
    };

    fetchData();

    return () => {
      dispatch(resetState());
      dispatch(clearEmailData());
      dispatch(clearInoltraRispondiConProtocollo());
    };
  }, [tipoRegistrazioneSel, metodoSpedizioneValue, pecAction]);

  const handleTipologia = (tipologia) => {
    if (
      tipologia === TipoRegistrazione.Interno ||
      tipologia === TipoRegistrazione.Circolare
    ) {
      methods.clearErrors('metodoSpedizione');
    }
    if (
      tipologia === TipoRegistrazione.Interno ||
      tipologia === TipoRegistrazione.Uscita ||
      tipologia === TipoRegistrazione.Circolare
    ) {
      methods.clearErrors('mittente');
    }
    if (tipologia === TipoRegistrazione.Entrata) {
      methods.resetField('mittente');
    }
    // pulisce i campi 'corpoPecPeo' e 'indirizzoPecPeo' ed eventuali errori quando si cambia la tipologia di registrazione
    if (!isRegistrazioneUscita) {
      methods.clearErrors('corpoPecPeo');
      methods.resetField('corpoPecPeo');
      methods.clearErrors('indirizzoPecPeo');
      methods.resetField('indirizzoPecPeo');
    }
  };

  const handleFlagTagChange = () => {
    methods.setValue('flagTag', !methods.getValues('flagTag'));
    methods.setValue('destinatariCompetenza', []);
    methods.setValue('destinatariConoscenza', []);
    methods.clearErrors('destinatariCompetenza');
    methods.clearErrors('destinatariConoscenza');
  };

  const structure: BaseInputProps<ProtocolloForm>[] = [
    {
      type: 'select',
      name: 'tipoRegistrazione',
      required: true,
      label: dictionary.get('tipologiaRegistrazione'),
      onChange: (tipologia) => {
        methods.clearErrors('metodoSpedizione');
        methods.resetField('metodoSpedizione');
        methods.setValue('destinatariCompetenza', null);
        methods.setValue('destinatariConoscenza', []);
        handleTipologia(tipologia);
      },
      options: Object.values(TipoRegistrazione)?.map((tipo) => ({
        label: toSentence(tipo),
        value: tipo
      })),
      disabled: pecAction || readMode,
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'select',
      name: 'metodoSpedizione',
      required: true,
      label: dictionary.get('metodoDiSpedizione'),
      disabled:
        pecAction ||
        readMode ||
        isTipoRegistrazioneInterno ||
        isTipoRegistrazioneCircolare,
      onChange: () => {
        // pulisce i campi 'corpoPecPeo' e 'indirizzoPecPeo' ed eventuali errori quando si cambia il metodo di spedizione
        methods.clearErrors('corpoPecPeo');
        methods.resetField('corpoPecPeo');
        methods.clearErrors('indirizzoPecPeo');
        methods.resetField('indirizzoPecPeo');
      },
      options: metodiSpedizione?.map((metodo) => ({
        label: dictionary.get(`metodoDiSpedizione${metodo}`),
        value: metodo
      })),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'select',
      name: 'indirizzoPecPeo',
      required: isPecPeo && isRegistrazioneUscita,
      label: `${dictionary.get('indirizzo')} ${metodoSpedizioneValue}`,
      disabled: readMode,
      sx:
        isPecPeo && isRegistrazioneUscita
          ? { width: { xs: 1, sm: 1 / 2 } }
          : { display: 'none' },
      options: pecPeoOptions?.map((pecPeo) => ({
        label: pecPeo,
        value: pecPeo
      }))
    },
    {
      type: 'checkbox',
      name: 'invioEmailMultiplo',
      label: (
        <Tooltip title={dictionary.get('invioMultiploTooltip')} placement="top">
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('invioMultiplo')}{' '}
            <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      ),
      disabled: readMode,
      sx:
        isPecPeo && isRegistrazioneUscita
          ? { width: { xs: 1, sm: 1 / 2 } }
          : { display: 'none' }
    },
    {
      type: 'custom',
      name: 'mittenteCustom',
      render: () => (
        <MittenteProtocolloForm
          readMode={readMode}
          formMethod={methods}
          tipoRegistrazioneSel={tipoRegistrazioneSel}
          metodoSpedizioneSel={metodoSpedizioneValue}
        />
      )
    },
    {
      type: 'checkbox',
      name: 'flagTag',
      onChange: () => handleFlagTagChange(),
      label: (
        <Tooltip title={dictionary.get('flagTagTooltip')} placement="top">
          <span>
            {dictionary.get('invioTag')} <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      ),
      disabled: readMode,
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'select-autocomplete',
      name: 'formTagList',
      required: isFlagTag,
      label: dictionary.get('tag'),
      query: (value: string) =>
        getAllTags({
          search: String(value)
        }),
      optionMapping: ({ data: { getAllTag: tags } }) =>
        tags?.map((tag: Tag) => ({
          label: tag?.nome,
          value: tag
        })) || [],
      onSelect: (value, setValue) => {
        setValue('formTagList', value.value);
      },
      componentProps: {
        multiple: true
      },
      sx: isFlagTag ? { width: { xs: 1, sm: 1 / 1 } } : { display: 'none' }
    },
    {
      type: 'custom',
      name: 'destinatari',
      sx: !isFlagTag ? { width: { xs: 1, sm: 1 / 1 } } : { display: 'none' },
      render: () => (
        <DestinatariProtocolloForm
          isFlagTag={isFlagTag}
          readMode={readMode}
          formMethod={methods}
          tipoRegistrazioneSel={tipoRegistrazioneSel}
          metodoSpedizioneSel={metodoSpedizioneValue}
        />
      )
    },
    {
      type: 'text',
      name: 'protocolloMittente',
      required: false,
      hidden: isTipoRegistrazioneCircolare,
      label: dictionary.get('protocolloMittente'),
      placeholder: dictionary.get('protocolloMittente'),
      sx: !isTipoRegistrazioneCircolare
        ? { width: { xs: 1, sm: 1 / 2 } }
        : { display: 'none' },
      validation: {
        validate: async (value: string) => {
          if (value && !isAlphaNumericDash(value)) {
            return dictionary.get('invalidNumProt');
          }
          return true;
        }
      }
    },
    {
      type: 'date',
      name: 'dataProtocolloMittente',
      required: false,
      label: dictionary.get('dataProtocolloMittente'),
      placeholder: dictionary.get('dataProtocolloMittente'),
      sx: !isTipoRegistrazioneCircolare
        ? { width: { xs: 1, sm: 1 / 2 } }
        : { display: 'none' },
      clearable: true,
      clearText: 'Cancella'
    },
    {
      type: 'text',
      name: 'oggetto',
      required: true,
      label: dictionary.get('oggetto'),
      placeholder: dictionary.get('oggetto'),
      sx: { width: { xs: 1, sm: 1 / 2 } },
      componentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 3,
        maxLength: !isRegistrazioneEntrata && maxLengthProtocolloOggetto // TODO: diventerà un parametro impostato dall'utente
      },
      validation: {
        validate: async (value: string) => {
          if (
            value &&
            !(
              isRegistrazioneEntrata &&
              (metodoSpedizioneValue === MetodoSpedizione.Pec ||
                metodoSpedizioneValue === MetodoSpedizione.Email)
            ) &&
            isOverLength(value, maxLengthProtocolloOggetto - 1)
          ) {
            return dictionary.get('maxCaratteri', {
              max: `${maxLengthProtocolloOggetto}`
            });
          }
          return true;
        }
      }
    },
    {
      type: 'text',
      name: 'note',
      required: false,
      disabled: defaultValues && !defaultValues?.canUpdateProtocollo,
      label: dictionary.get('note'),
      placeholder: dictionary.get('note'),
      sx: { width: { xs: 1, sm: 1 / 2 } },
      componentProps: {
        multiline: true,
        minRows: 3,
        maxLength: 250
      }
    },
    {
      type: 'text',
      name: 'corpoPecPeo',
      required: isPecPeo && isRegistrazioneUscita,
      label: `${dictionary.get('corpo')} ${metodoSpedizioneValue}`,
      sx:
        isPecPeo && isRegistrazioneUscita
          ? { width: { xs: 1, sm: 1 } }
          : { display: 'none' },
      componentProps: {
        multiline: true,
        minRows: 8
      }
    },
    {
      type: 'searchable-inputPiMod',
      name: 'nProtocolloCircolare',
      title: dictionary.get('protocolloCircolare'),
      label: dictionary.get('protocolloCircolare'),
      required: false,
      disabled: defaultValues && !defaultValues?.canUpdateProtocollo,
      sx: !isTipoRegistrazioneCircolare
        ? { width: { xs: 1, sm: 1 / 2 } }
        : { display: 'none' },
      href: '/protocolli',
      componentProps: {
        multiline: false,
        searchBody: (
          <SearchProtocolli
            defaultValues={{
              anno: new Date().getFullYear(),
              filtroUfficio: true,
              filtroAll: false,
              ricercaAvanzata: false
            }}
            onSelectItem={(protocollo) =>
              methods.setValue('nProtocolloCircolare', protocollo?.nProtocollo)
            }
            onSearchClose={() => setOpenProtocolloCircolare(false)}
          />
        ),
        searchOpen: openProtocolloCircolare,
        onSearchOpen: () => setOpenProtocolloCircolare(true),
        onSearchClose: () => setOpenProtocolloCircolare(false)
      }
    },
    {
      type: 'custom',
      name: 'titolarioCustom',
      sx: { width: { xs: 1, sm: 1 / 2 } },
      render: () => (
        <TitolarioProtcolloForm
          readMode={readMode}
          formMethod={methods}
          titolarioRequired={true}
        />
      )
    },
    {
      type: 'text',
      name: 'nProtocolloEmergenza',
      required: false,
      label: dictionary.get('nProtocolloEmergenza'),
      placeholder: dictionary.get('nProtocolloEmergenza'),
      sx: {
        width: { xs: 1, sm: 1 / 2 },
        display: !readMode ? 'none' : 'block'
      }
    },
    {
      type: 'date',
      name: 'dataProtocolloEmergenza',
      required: false,
      label: dictionary.get('dataProtocolloEmergenza'),
      placeholder: dictionary.get('dataProtocolloEmergenza'),
      sx: {
        width: { xs: 1, sm: 1 / 2 },
        display: !readMode ? 'none' : 'block'
      },
      clearable: true,
      clearText: 'Cancella'
    }
  ];

  return { methods, structure, isPecPeo, isRegistrazioneUscita };
};
