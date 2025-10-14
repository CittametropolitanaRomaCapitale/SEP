import { FCC } from '@cmrc/types/FCC';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Checkbox from '../../FormComponents/Checkbox';
import { useFGProvider } from '../core/context';
import { FGHookForm, CheckboxProps, OverrideRequired } from '../core/types';

export const FGCheckbox: FCC<
  FGHookForm<OverrideRequired<CheckboxProps<any>>>
> = ({ componentProps, ...props }) => {
  const [checked, setChecked] = useState(props?.value ? props?.value : false);
  const { setValue, trigger, control } = useFormContext();

  useEffect(() => {
    if (props?.value) {
      setValue(props.name as string, props?.value);
    }
  }, []);

  const fgProviderProps = useFGProvider();

  const onChange = (event: any) => {
    const val = event.target.checked;
    if (props.onChange) props.onChange(val);
    setChecked(val);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <Checkbox
      {...fgProviderProps}
      {...componentProps}
      {...props}
      onChange={onChange}
      checked={checked || props.value}
    />
  );
};
