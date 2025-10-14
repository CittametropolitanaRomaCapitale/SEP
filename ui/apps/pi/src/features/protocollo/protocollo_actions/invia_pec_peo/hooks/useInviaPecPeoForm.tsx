import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  MetodoSpedizione,
  NotificaProtocolloPecPeoInputInput,
  TipologiaPosta,
  TipoRegistrazione
} from '@cmrc/services/src/app/piapi/generated';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { dictionary } from '../dictionary';
import { InviaPecPeoAllegati } from '../InviaPecPeoAllegati';
import { configurazioniFormProtocollo } from '../../../../../hooks/useConfigurazioniFormProtocollo';
import { DestinatariProtocolloForm } from '../../../protocollo_form/DestinatariProtocolloForm';
import { InviaPecPeoMittente } from '../InviaPecPeoMittente';
import { ProtocolloForm } from '../../../protocollo_form/hooks/useDestinatariProtocolloForm';

export const useInviaPecPeoForm = (protocolloData, tipologiaPosta) => {
  const { maxLengthProtocolloOggetto } = configurazioniFormProtocollo();
  const methods = useForm<NotificaProtocolloPecPeoInputInput & ProtocolloForm>({
    defaultValues: protocolloData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });
  const structure: BaseInputProps<NotificaProtocolloPecPeoInputInput>[] = [
    {
      type: 'custom',
      name: 'headerUtente',
      render: () => (
        <InviaPecPeoMittente
          formMethod={methods}
          tipologiaPosta={tipologiaPosta}
        />
      )
    },
    {
      type: 'custom',
      name: 'destinatari',
      render: () => (
        <DestinatariProtocolloForm
          readMode={false}
          formMethod={methods}
          tipoRegistrazioneSel={TipoRegistrazione.Uscita}
          metodoSpedizioneSel={
            tipologiaPosta === TipologiaPosta.Pec
              ? MetodoSpedizione.Pec
              : MetodoSpedizione.Email
          }
        />
      )
    },
    {
      type: 'checkbox',
      name: 'multiplo',
      label: (
        <Tooltip title={dictionary.get('invioMultiploTooltip')} placement="top">
          <span className="MuiFormLabel-colorPrimary css-1mvtz0k css-srr2bv-MuiFormLabel-root">
            {dictionary.get('invioMultiplo')}{' '}
            <InfoIcon sx={{ fontSize: 'small' }} />
          </span>
        </Tooltip>
      )
    },
    {
      type: 'text',
      name: 'oggetto',
      required: true,
      label: dictionary.get('oggettoMail'),
      placeholder: dictionary.get('oggettoMail'),
      sx: { width: { xs: 1, sm: 1 / 1 } },
      componentProps: {
        multiline: true,
        minRows: 1,
        maxRows: 1,
        maxLength: maxLengthProtocolloOggetto // TODO: diventerà un parametro impostato dall'utente
      }
    },
    {
      type: 'text',
      name: 'corpo',
      required: false,
      label: dictionary.get('corpoMail'),
      placeholder: dictionary.get('corpoMail'),
      sx: { width: { xs: 1, sm: 1 / 1 } },
      componentProps: {
        multiline: true,
        minRows: 10,
        maxRows: 10
      }
    },
    {
      type: 'custom',
      name: 'allegati',
      required: false,
      render: () => <InviaPecPeoAllegati formMethod={methods} />
    }
  ];

  return { methods, structure };
};
