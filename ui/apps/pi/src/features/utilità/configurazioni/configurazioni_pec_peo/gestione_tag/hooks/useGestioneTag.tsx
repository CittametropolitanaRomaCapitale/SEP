import toast from '@cmrc/ui/components/Toast';
import {
  TagInputInput,
  useSaveTagMutation,
  useUpdateTagMutation
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const useGestioneTag = () => {
  const [saveTagMutation, { isLoading: isLoadingSave }] = useSaveTagMutation();
  const [updateTagMutation, { isLoading: isLoadingUpdate }] =
    useUpdateTagMutation();

  const saveTag = async (data: TagInputInput) => {
    const response = await saveTagMutation({
      tagInput: data
    }).unwrap();
    if (response?.saveTag?.id) {
      toast.success(dictionary.get('tagSalvato'));
    }
    return response;
  };

  const updateTag = async ({
    id,
    tagInput
  }: {
    id: number;
    tagInput: TagInputInput;
  }) => {
    const response = await updateTagMutation({
      id,
      tagInput
    }).unwrap();
    if (response?.updateTag?.id) {
      toast.success(dictionary.get('tagModificato'));
    }
    return response;
  };

  return {
    saveTag,
    updateTag,
    isLoadingSave: isLoadingSave || isLoadingUpdate
  };
};
