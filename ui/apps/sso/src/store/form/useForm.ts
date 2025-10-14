import { useAppDispatch, useAppSelector } from '../hooks';
import { setDefaultValues as setDefaultValuesAction } from './formSlice';

export const useFormState = (args: { form_id: string }) => {
  const dispatch = useAppDispatch();

  const setDefaultValues = ({ default_values }): void => {
    dispatch(
      setDefaultValuesAction({ form_id: args?.form_id, default_values })
    );
  };

  const defaultValues = useAppSelector((state) => state.form.default_values);

  return {
    setDefaultValues,
    defaultValues
  };
};
