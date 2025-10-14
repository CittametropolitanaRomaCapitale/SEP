import { FCC } from '@cmrc/types/FCC';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SearchableInput from '../../FormComponents/SearchableInput';
import { useFGProvider } from '../core/context';
import {
  FGHookForm,
  OverrideRequired,
  SearchableInputProps,
  SearchableInputPropsPIMod
} from '../core/types';
import SearchableInputPiMod from '../../FormComponents/SearchableInputPIMod';

export const FGSearchableInputPiMod: FCC<
  FGHookForm<OverrideRequired<SearchableInputPropsPIMod<any>>>
> = ({ componentProps, ...props }) => {
  const [val, setVal] = useState(null);
  const { setValue, trigger, control } = useFormContext();
  const fgProviderProps = useFGProvider();

  useEffect(() => {
    setVal(props?.value ? props?.value : null);
    if (props?.value) {
      trigger(props.name);
      if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
    }
  }, [props?.value]);

  const onClear = () => {
    setVal(null);
    setValue(props.name as string, null);
    trigger(props.name);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <SearchableInputPiMod
      {...fgProviderProps}
      {...componentProps}
      {...props}
      value={val}
      required={props?.required}
      onClear={onClear}
    />
  );
};
