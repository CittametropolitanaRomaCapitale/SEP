import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FCC } from '@cmrc/types/FCC';
import Textarea from '../../FormComponents/Textarea';
import { useFGProvider } from '../core/context';
import { FGHookForm, OverrideRequired, TextareaProps } from '../core/types';

export const FGTextarea: FCC<
  FGHookForm<OverrideRequired<TextareaProps<any>>>
> = ({ componentProps, ...props }) => {
  const fgProviderProps = useFGProvider();
  const { setValue, trigger, control } = useFormContext();
  const [val, setVal] = useState('');

  useEffect(() => {
    if (props?.value !== null) {
      setValue(props.name as string, props?.value);
      setVal(props?.value);
    }
  }, [props?.value]);

  const onChange = (event: any) => {
    const value = event.target.value;
    setValue(props.name as string, value);
    setVal(value);
    if (props.onChange) props.onChange(value);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <Textarea
      {...fgProviderProps}
      {...componentProps}
      {...props}
      onChange={onChange}
      value={val}
    />
  );
};
