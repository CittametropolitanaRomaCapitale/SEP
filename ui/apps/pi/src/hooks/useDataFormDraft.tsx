import { createContext, useContext, useMemo, useState } from 'react';

type ValueChangedType = {
  fieldName: string;
  formValue: any;
  defaultValue?: any;
};

type FormDraftContextProps = {
  valueChanged: boolean;
  setValueChanged?: (data?: ValueChangedType) => void;
  clearValueChanged?: () => void;
};

const FormDraftContext = createContext<FormDraftContextProps>({
  valueChanged: false
});

export const FormDraftProvider = ({ children }) => {
  const [data, setData] = useState<string[]>([]);

  const setValueChanged = ({
    fieldName,
    formValue,
    defaultValue
  }: ValueChangedType) =>
    setData((prevState) => {
      const index = prevState?.indexOf(fieldName);
      if (String(formValue || '') !== String(defaultValue || '')) {
        return index > -1 ? [...prevState] : [...prevState, fieldName];
      }
      if (index > -1) {
        prevState.splice(index, 1);
      }
      return [...prevState];
    });

  const clearValueChanged = () => setData([]);

  const valueChanged = data?.length > 0;

  const value = useMemo(
    () => ({ valueChanged, setValueChanged, clearValueChanged }),
    [valueChanged]
  );

  return (
    <FormDraftContext.Provider value={value}>
      {children}
    </FormDraftContext.Provider>
  );
};

export const useGetFormDraft = () => useContext(FormDraftContext);
