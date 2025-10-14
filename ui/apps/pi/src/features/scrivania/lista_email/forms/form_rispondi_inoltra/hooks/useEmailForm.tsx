import { useForm } from 'react-hook-form';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { BaseInputProps, FGOption } from '@cmrc/ui/form/FormGenerator/core/types';
import { EmailBaseFragment, InoltraRispondiInput, useLazyGetConfiguredUsersQuery } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { configurazioniFormProtocollo } from '../../../../../../hooks/useConfigurazioniFormProtocollo';
import { EmailAttachments } from '../EmailAttachments';

export type EmailFormData = InoltraRispondiInput & EmailBaseFragment & {
  destinatariTo: FGOption[]
  destinatariCc: FGOption[]
}

export const useEmailForm = (
  initialData: EmailFormData = null
) => {
  const { user } = useAuth();
  const { maxLengthProtocolloOggetto } = configurazioniFormProtocollo();
  const [getUserEmails] = useLazyGetConfiguredUsersQuery();


  const methods = useForm<EmailFormData>({
    defaultValues: initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<EmailFormData>[] = [
    {
      type: 'select-autocomplete',
      name: 'destinatariTo',
      required: true,
      label: dictionary.get('destinatariTo'),
      query: () => getUserEmails(),
      optionMapping: ({ data: userList }) =>
        userList?.getConfiguredUsers?.map((userMap) => ({
          label: userMap?.indirizzoEmail,
          value: userMap?.indirizzoEmail
      })),
      onSelect: (value, setValue) => {
        setValue('destinatariTo', value.value);
      },
      componentProps: {
        multiple: true
      },
      sx: {width: { xs: 1, sm: 1 / 1 }}
    },
    {
      type: 'select-autocomplete',
      name: 'destinatariCc',
      required: false,
      label: dictionary.get('destinatariCc'),
      query: () => getUserEmails(),
      optionMapping: ({ data: userList }) =>
        userList?.getConfiguredUsers?.map((userMap) => ({
          label: userMap?.indirizzoEmail,
          value: userMap?.indirizzoEmail
      })),
      onSelect: (value, setValue) => {
        setValue('destinatariCc', value.value);
      },
      componentProps: {
        multiple: true
      },
      sx: {width: { xs: 1, sm: 1 / 1 }}
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
        maxLength: maxLengthProtocolloOggetto  // TODO: diventerà un parametro impostato dall'utente
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
        maxRows: 10,
        // maxLength:   // TODO: diventerà un parametro impostato dall'utente ?
      }
    },
    {
      type: 'custom',
      name:'allegati',
      render: () => <EmailAttachments attachments={undefined} setAttachments={undefined} />
      // render: () => <EmailAttachments attachments={methods.watch('allegati')} setAttachments={methods.setValue('allegati')} />
    }
  ];

  return { methods, structure };
};

