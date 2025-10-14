import toast from '@cmrc/ui/components/Toast';
import {
  PecEscluseRispostaAutomaticaInputInput,
  useSavePecEsclusaMutation,
  useUpdatePecEsclusaMutation
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const useGestionePecEscluseRispostaAutomatica = () => {
  const [savePecEsclusaMutation, { isLoading: isLoadingSave }] =
    useSavePecEsclusaMutation();
  const [updatePecEsclusaMutation, { isLoading: isLoadingUpdate }] =
    useUpdatePecEsclusaMutation();

  const savePecEsclusa = async (
    data: PecEscluseRispostaAutomaticaInputInput
  ) => {
    const response = await savePecEsclusaMutation({
      pecInput: data
    }).unwrap();
    if (response?.savePecEsclusa?.id) {
      toast.success(dictionary.get('pecEsclusaSalvata'));
    }
    return response;
  };

  const updatePecEsclusa = async ({
    id,
    pecInput
  }: {
    id: number;
    pecInput: PecEscluseRispostaAutomaticaInputInput;
  }) => {
    const response = await updatePecEsclusaMutation({
      id,
      pecInput
    }).unwrap();
    if (response?.updatePecEsclusa?.id) {
      toast.success(dictionary.get('pecEsclusaModificata'));
    }
    return response;
  };

  return {
    savePecEsclusa,
    updatePecEsclusa,
    isLoadingSave: isLoadingSave || isLoadingUpdate
  };
};
