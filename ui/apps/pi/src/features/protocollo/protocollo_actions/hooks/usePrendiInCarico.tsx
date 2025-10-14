import { StatoProtocollo, StatoProtocolloInputInput, useUpdateStatoProtocolloMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { dictionary } from '../../dictionary';

export const usePrendiInCarico = () => {
  const [updateStatoProtocollo] = useUpdateStatoProtocolloMutation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const prendiInCarico = async (protocolloData) => {
    const input: StatoProtocolloInputInput = {
      idProtocollo: protocolloData?.id,
      statoProtocollo: StatoProtocollo.PresoInCarico,
      selectedOffice: user?.selectedOffice?.office?.code || undefined
    };
    setLoading(true);
    try {
      const response = await updateStatoProtocollo({
        input
      }).unwrap();
      if (response?.updateStatoProtocollo) {
        toast.success(dictionary.get('presaInCaricoOK'));
        if (router?.asPath !== `/protocolli/${protocolloData?.nProtocollo}`) {
          router.push(`/protocolli/${protocolloData?.nProtocollo}`);
        } else {
          router.reload();
        }
      }
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };
  return { prendiInCarico, loading };
}