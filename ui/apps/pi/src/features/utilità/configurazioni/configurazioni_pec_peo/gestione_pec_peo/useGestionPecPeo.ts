import { 
  PecPeoDtoInputInput,
  useSavePecPeoConfigurationMutation,
  useUpdateConfigurationsMutation,
} from '@cmrc/services/src/app/piapi/generated';

export const useGestionPecPeo = () => {
  const [savePecPeoConfigurationMutation, { isLoading: isLoadingSave }] = useSavePecPeoConfigurationMutation();
  const [updatePecPeoConfigurationMutation, { isLoading: isLoadingUpdate }] = useUpdateConfigurationsMutation();

  const savePecPeoConfig = async (input: PecPeoDtoInputInput) => {
    const response = await savePecPeoConfigurationMutation({
      input
    }).unwrap();

    return response;
  };

  const updatePecPeoConfig = async ({id, input}: {id: number, input: PecPeoDtoInputInput}) => {
    const response = await updatePecPeoConfigurationMutation({
      id,
      input
    }).unwrap();

    return response;
  };

  return {
    savePecPeoConfig,
    updatePecPeoConfig,
    isLoadingSave: isLoadingSave || isLoadingUpdate,
  };
};

