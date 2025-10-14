import { useEffect, useState } from 'react';
import CurrencyInput from '../../FormComponents/CurrencyInput';
import { useFormContext } from 'react-hook-form';
import {
  FGHookForm,
  CurrencyInputProps,
  OverrideRequired
} from '../core/types';
import { useFGProvider } from '../core/context';
import { FCC } from '@cmrc/types/FCC';

export const FGCurrencyInput: FCC<
  FGHookForm<OverrideRequired<CurrencyInputProps<any>>>
> = ({ componentProps, type, ...props }) => {
  const fgProviderProps = useFGProvider();
  const { setValue, trigger, control } = useFormContext();
  const [val, setVal] = useState(null);

  useEffect(() => {
    if (props?.value != undefined && props?.value !== '') {
      setValue(props.name as string, Number(props?.value));
      setVal(props?.value);
    } else {
      setValue(props.name as string, '');
      setVal('');
    }
  }, []);

  const onChange = (value: any) => {
    if (props.onChange) props.onChange(value);
    setValue(props.name as string, value);
    setVal(value);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <CurrencyInput
      {...fgProviderProps}
      {...componentProps}
      {...props}
      value={val}
      onChange={onChange}
    />
  );
};
