import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  DatiUtenteSso,
  useGetPecPeoByTipologiaPostaQuery
} from '@cmrc/services/src/app/piapi/generated';
import { useOffice } from '@cmrc/auth/useOffice';
import { useGetApiUserByIdQuery } from '@cmrc/services/sso';
import { dictionary } from '../dictionary';
import { ProtocolloForm } from '../../../protocollo_form/hooks/useDestinatariProtocolloForm';

export const useInviaPecPeoMittenteForm = (formMethod, tipologiaPosta) => {
  const { cdrCode } = useOffice();
  const { user } = useAuth();
  const userInfo: DatiUtenteSso = useGetApiUserByIdQuery({
    id: Number(user?.selectedOffice?.user_id)
  }).data;
  const { data } = useGetPecPeoByTipologiaPostaQuery(
    {
      idUtente: userInfo?.auth_id,
      tipologiaPosta,
      selectedCdrCode: cdrCode
    },
    {
      skip: !userInfo?.auth_id || !cdrCode
    }
  );

  const mittentiList = data?.getPecPeoByTipologiaPosta || [];

  const structure: BaseInputProps<ProtocolloForm>[] = [
    {
      type: 'select',
      name: 'from',
      required: true,
      value: mittentiList.length > 0 ? mittentiList[0] : '',
      label: `${dictionary.get('mittente')}`,
      options: mittentiList.map((pecPeo) => ({ label: pecPeo, value: pecPeo })),
      onChange: (selectedOption) => {
        formMethod.setValue('from', selectedOption);
      },
      componentProps: {
        multiple: false
      },
      sx: { width: { xs: 1, sm: 4 / 12 } }
    }
  ];

  return { structure };
};
