import { useState, MouseEvent, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { Office, SSOApi as api } from '@cmrc/services/sso';
import { PecPeo, TipologiaPosta } from '@cmrc/services/src/app/piapi/generated';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { dictionary } from './dictionary';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';

export type UserDataInput = {
  authId: string;
  username: string;
  fullName: string;
};

type PecPeoForm = {
  idUtente: string;
  indirizzoEmail: string;
  password: string;
  formSwitch: string;
  tipologiaPosta: string;
  saveToSent: boolean;
  readPec: boolean;
  deleteMessages: boolean;
  mustSendRispostaAutomatica: boolean;
  utenteForm: {
    label: string;
    value: UserDataInput;
  };
  ufficiForm: Array<{ label: string; value: string }>;
};

export const usePecPeoForm = (props: { initialData: PecPeo } = null) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPeoSelected, setIsPeoSelected] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [userListQuery] =
    api.endpoints.getApiOfficeByOfficeIdApplicationAndApplicationIdUsers.useLazyQuery();
  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();

  const initialData: PecPeoForm = useMemo(
    () => ({
      tipologiaPosta:
        props?.initialData?.configurazione?.tipologiaPosta || undefined,
      utenteForm: props?.initialData?.idUtente
        ? {
      label: `${props?.initialData?.username} - (${props?.initialData?.utente})`,
      value: {
        authId: props?.initialData?.idUtente,
        username: props?.initialData?.username,
        fullName: props?.initialData?.utente
      }
          }
        : undefined,
      ufficiForm:
        props?.initialData?.uffici?.map((ufficio) => ({
      label: ufficio.cdr,
      value: ufficio.cdrCode
    })) || [],
    indirizzoEmail: props?.initialData?.indirizzoEmail || undefined,
    password: props?.initialData?.password || undefined,
    idUtente: props?.initialData?.idUtente || undefined,
    formSwitch: props?.initialData?.idUtente ? 'utente' : 'cdr',
    saveToSent: props?.initialData?.saveToSent ?? false,
    readPec : props?.initialData?.readPec  ?? false,
    deleteMessages: props?.initialData?.deleteMessages ?? false,
      mustSendRispostaAutomatica:
        props?.initialData?.mustSendRispostaAutomatica ?? false
    }),
    [props?.initialData]
  );

  useEffect(() => {
    if (initialData) {
      setIsPeoSelected(initialData?.tipologiaPosta === 'PEO');
    }
  }, [initialData]);

  const methods = useForm<PecPeoForm>({
    defaultValues: initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const [hideCdr, sethideCdr] = useState<boolean>(
    initialData?.idUtente != null
  );
  const handleSwitchChange = () => {
    methods.clearErrors('ufficiForm');
    methods.clearErrors('utenteForm');
    methods.setValue('utenteForm', null);
    methods.setValue('ufficiForm', []);
  };

  const structure: BaseInputProps<PecPeoForm>[] = [
    {
      type: 'select',
      name: 'tipologiaPosta',
      label: dictionary.get('tipologiaPosta'),
      required: true,
      options: Object.values(TipologiaPosta)
        .filter((type) => type !== 'RICEVUTA')
        .map((type) => ({
          label: type,
          value: type
        })),
      onChange: (value) => {
        setIsPeoSelected(value === 'PEO');
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'switch',
      name: 'formSwitch',
      title: hideCdr ? 'Utente' : 'Cdr',
      checked: hideCdr,
      onChange: (value) => {
        handleSwitchChange();
        sethideCdr(value);
      },
      sx: { width: { xs: 1, sm: 1 / 5 } },
      icon: <ApartmentIcon />,
      checkedIcon: <PersonIcon />
    },
    {
      type: 'select-autocomplete',
      name: 'ufficiForm',
      required: !hideCdr,
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
        setValue('ufficiForm', value);
      },
      componentProps: {
        multiple: true
      },
      sx: !hideCdr
        ? { width: { xs: 1, sm: 4 / 5 }, maxWidth: 400 }
        : { display: 'none' }
    },
    {
      type: 'select-autocomplete',
      name: 'utenteForm',
      required: hideCdr,
      label: dictionary.get('utente'),
      query: (value) =>
        userListQuery({
          applicationId: 3,
          officeId: 'all',
          search: value ?? '',
          size: 50
        }),
      optionMapping: ({ data }) =>
        data?.data.map((user) => ({
          label: `${user.username} - (${user.firstName} ${user.lastName})`,
          value: {
            authId: user.auth_id,
            username: user.username,
            fullName: `${user.firstName} ${user.lastName}`
          }
        })) || [],
      onSelect: (value, setValue) => {
        setValue('utenteForm', value.value);
      },
      componentProps: {
        multiple: false
      },
      sx: hideCdr ? { width: { xs: 1, sm: 4 / 5 } } : { display: 'none' }
    },
    {
      type: 'email',
      name: 'indirizzoEmail',
      label: dictionary.get('indirizzo'),
      required: true
    },
    {
      type: showPassword ? 'text' : 'password',
      name: 'password',
      label: dictionary.get('password'),
      required: !isPeoSelected,
      inputRightElement: (
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          <VisibilityIcon />
        </IconButton>
      )
    },
    {
      type: 'checkbox',
      name: 'deleteMessages',
      label: (
        <Tooltip
          title={dictionary.get('deleteMessagesTooltip')}
          placement="top"
        >
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('deleteMessages')}{' '}
            <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      ),
      sx:
        methods?.watch('tipologiaPosta') === TipologiaPosta.Pec
          ? { width: { xs: 1, sm: 1 } }
          : { display: 'none' }
    },
    {
      type: 'checkbox',
      name: 'saveToSent',
      label: (
        <Tooltip title={dictionary.get('saveToSentTooltip')} placement="top">
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('saveToSent')}{' '}
            <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      ),
      sx:
        methods?.watch('tipologiaPosta') === TipologiaPosta.Pec
          ? { width: { xs: 1, sm: 1 } }
          : { display: 'none' }
    },
    {
      type: 'checkbox',
      name: 'readPec',
      label: (
        <Tooltip title={dictionary.get('readPecTooltip')} placement="top">
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('readPec')} <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      ),
      sx:
        methods?.watch('tipologiaPosta') === TipologiaPosta.Pec
          ? { width: { xs: 1, sm: 1 } }
          : { display: 'none' }
    },
    {
      type: 'checkbox',
      name: 'mustSendRispostaAutomatica',
      label: (
        <Tooltip
          title={dictionary.get('mustSendRispostaAutomaticaTooltip')}
          placement="top"
        >
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('mustSendRispostaAutomatica')}{' '}
            <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      ),
      sx:
        methods?.watch('tipologiaPosta') === TipologiaPosta.Pec
          ? { width: { xs: 1, sm: 1 } }
          : { display: 'none' }
    }
  ];

  return { methods, structure };
};
