import { FCC } from '@cmrc/types/FCC';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SelectCheckbox from '../../FormComponents/SelectCheckbox';
import { useFGProvider } from '../core/context';
import {
  FGHookForm,
  OverrideRequired,
  SelectCheckboxProps
} from '../core/types';

export const FGSelectCheckbox: FCC<
  FGHookForm<OverrideRequired<SelectCheckboxProps<any>>>
> = ({ componentProps, ...props }) => {
  const [val, setval] = useState(props?.value ? props?.value : '');
  const { setValue, trigger, control } = useFormContext();

  useEffect(() => {
    if (props?.value) {
      setValue(props.name as string, props?.value);
    }
  }, []);

  const fgProviderProps = useFGProvider();

  const onChange = (event: any) => {
    const value = event.target.value?.length > 0 ? event.target.value[0] : '';
    setval(value);
    setValue(props.name as string, value);
    if (props.onChange) props.onChange(value);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  const onDeleteItem = (value: any) => {
    let selected = val.filter((option: any) => {
      return option !== value;
    });
    setval(selected);
    setValue(props.name as string, selected);
  };

  return (
    <SelectCheckbox
      {...fgProviderProps}
      {...componentProps}
      {...props}
      options={props.options}
      value={val}
      required={props?.required}
      onChange={onChange}
      onDeleteItem={onDeleteItem}
    />
  );
};
