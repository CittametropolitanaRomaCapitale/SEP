import { FCC } from '@cmrc/types/FCC';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFGProvider } from '../core/context';
import Switch from '../../FormComponents/Switch';
import { FGHookForm, OverrideRequired, SwitchProps } from '../core/types';

type ExtendedSwitchProps<T> = SwitchProps<T> & {
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
};

export const FGSwitch: FCC<
  FGHookForm<OverrideRequired<ExtendedSwitchProps<any>>>
> = ({ componentProps, onSelect, ...props }) => {
  const [val, setval] = useState(props?.value ? props?.value : '');
  const { setValue, trigger, control } = useFormContext();

  useEffect(() => {
    if (props?.value) {
      setValue(props.name as string, props?.value);
    }
  }, []);

  const fgProviderProps = useFGProvider();

  const onChange = (event: any) => {
    const value = event.target.checked;
    setval(value);
    setValue(props.name as string, value);
    if (props.onChange) props.onChange(value);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <Switch
      {...fgProviderProps}
      {...componentProps}
      {...props}
      onChange={onChange}
      options={props.options}
      value={val}
      icon={props.icon}
      checkedIcon={props.checkedIcon}
    />
  );
};
