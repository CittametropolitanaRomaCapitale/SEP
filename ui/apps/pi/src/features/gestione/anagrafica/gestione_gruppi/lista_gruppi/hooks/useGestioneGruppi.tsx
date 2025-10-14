import toast from '@cmrc/ui/components/Toast';
import { GruppoAnagraficaDtoInput, useSaveGruppoMutation, useUpdateGruppoMutation } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../../dictionary';

export const useGestioneGruppi = () => {
  const [saveGruppoMutation, { isLoading: isLoadingSave }] = useSaveGruppoMutation();
  const [updateGruppoMutation, { isLoading: isLoadingUpdate }] = useUpdateGruppoMutation();

  const saveGruppo = async (data: GruppoAnagraficaDtoInput) => {
    const response = await saveGruppoMutation({
      gruppoAnagraficaDTO: data
    }).unwrap();
    if (response?.saveGruppo?.id) {
      toast.success(dictionary.get('gruppoSalvato'));
    }
    return response;
  };

  const updateGruppo = async ({ id, input }: { id: number, input: GruppoAnagraficaDtoInput }) => {
    const response = await updateGruppoMutation({
      groupId: id,
      input
    }).unwrap();
    if (response?.updateGruppo?.id) {
      toast.success(dictionary.get('gruppoModificato'));
    }
    return response;
  };

  return {
    saveGruppo,
    updateGruppo,
    isLoadingSave: isLoadingSave || isLoadingUpdate
  };
};

