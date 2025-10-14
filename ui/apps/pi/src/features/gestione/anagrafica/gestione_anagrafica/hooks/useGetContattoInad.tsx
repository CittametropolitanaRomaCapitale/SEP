import { useLazyGetContattoInadQuery } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import toast from '@cmrc/ui/components/Toast';

export const useGetContattoInad = () => {
  const [trigger, { data, isLoading, error }] = useLazyGetContattoInadQuery();

  const getContattoInad = async (codiceFiscale: string) => {
    try {
      const response = await trigger({ codiceFiscale }).unwrap();
      toast.success(dictionary.get('contattoRecuperato'));
      return response;
    } catch (err) {
      toast.error(dictionary.get('erroreRecuperoContatto'));
      throw err;
    }
  };

  return {
    getContattoInad,
    data,
    isLoading,
    error
  };
};
