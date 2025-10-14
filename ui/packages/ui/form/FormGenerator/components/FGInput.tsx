import { FCC } from '@cmrc/types/FCC';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../../FormComponents/Input';
import { useFGProvider } from '../core/context';
import { FGHookForm, InputProps, OverrideRequired } from '../core/types';
import Validator from '../utils/Validator';

export const useMUIInput: (
  props: FGHookForm<OverrideRequired<InputProps<any>>>
) => FGHookForm<OverrideRequired<InputProps<any>>> = (props) => {
  let defaultValidation: any = {};

  switch (props.type) {
    case 'email':
      defaultValidation.value = Validator.email.UnCommon;
      defaultValidation.message = 'Please enter a valid email address.';
      break;
    case 'url':
      defaultValidation.value = Validator.url;
      defaultValidation.message = 'Please enter a valid url.';
      break;
    case 'text':
      defaultValidation.value = Validator.alphanumeric.WithSpaces;
      break;
    case 'password':
      defaultValidation.value = Validator.alphanumeric.WithoutSpaces;
    case 'email':
      defaultValidation.value = Validator.email.email;
      break;
    case 'address':
      defaultValidation.value = Validator.address;
      break;
    case 'url':
      defaultValidation.value = Validator.url.url2;
    default:
      break;
  }

  return { ...props, defaultValidation };
};

export const FGInput: FCC<FGHookForm<OverrideRequired<InputProps<any>>>> = (
  props
) => {
  const { componentProps, ...muiProps } = useMUIInput(props);
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
    <Input
      {...fgProviderProps}
      {...componentProps}
      {...muiProps}
      onChange={onChange}
      value={val}
    />
  );
};
