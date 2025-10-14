import {
  PecRegolaInputDtoInput,
  useAddRegolaMutation
} from '@cmrc/services/src/app/piapi/generated';

export const useGestioneRegoleMonitoraggio = () => {
  const [saveOrUpdateRegola, { isLoading: isLoadingSave }] =
    useAddRegolaMutation();

  const saveOrUpdateRule = async (input: PecRegolaInputDtoInput) => {
    const response = await saveOrUpdateRegola({
      input
    }).unwrap();

    return response;
  };

  return {
    saveOrUpdateRule,
    isLoadingSave: isLoadingSave
  };
};
