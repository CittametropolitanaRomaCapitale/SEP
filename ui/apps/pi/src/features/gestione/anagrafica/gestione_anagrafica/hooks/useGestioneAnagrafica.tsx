import toast from '@cmrc/ui/components/Toast';
import {
  AnagraficaInputInput,
  useSaveContattoMutation,
  useUpdateContattoMutation,
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const useGestioneAnagrafica = () => {
  const [saveContattoMutation, { isLoading: isLoadingSave }] = useSaveContattoMutation();
  const [updateContattoMutation, { isLoading: isLoadingUpdate }] = useUpdateContattoMutation();

  const saveContatto = async (data: AnagraficaInputInput) => {
    const response = await saveContattoMutation({
      anagraficaInput: data
    }).unwrap();
    if (response?.saveContatto?.id) {
      toast.success(dictionary.get('contattoSalvato'));
    }
    return response;
  };

  const updateContatto = async ({ id, input }: { id: number, input: AnagraficaInputInput }) => {
    const response = await updateContattoMutation({
      id,
      input
    }).unwrap();
    if (response?.updateContatto?.id) {
      toast.success(dictionary.get('contattoSalvato'));
    }
    return response;
  };

  return {
    saveContatto,
    updateContatto,
    isLoadingSave: isLoadingSave || isLoadingUpdate
  };
};

