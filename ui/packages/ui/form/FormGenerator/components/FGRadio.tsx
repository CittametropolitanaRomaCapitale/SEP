import { FCC } from '@cmrc/types/FCC';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Radio from '../../FormComponents/Radio';
import { useFGProvider } from '../core/context';
import { FGHookForm, OverrideRequired, RadioProps } from '../core/types';

export const FGRadio: FCC<FGHookForm<OverrideRequired<RadioProps<any>>>> = ({
  componentProps,
  onSelect,
  ...props
}) => {
  const { setValue, trigger, control } = useFormContext();
  const [selected, setSelected] = useState(
    props?.value != null ? props?.value?.toString() : null
  );

  useEffect(() => {
    if (props?.value != null) {
      setValue(props.name as string, props?.value?.toString());
    }
  }, []);

  const fgProviderProps = useFGProvider();

  const onChange = (event: any) => {
    const value = event.target.value;
    if (props.onChange) props.onChange(value);
    if (onSelect) onSelect(value);
    setSelected(value);
    setValue(props.name as string, value?.toString());
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <Radio
      {...fgProviderProps}
      {...componentProps}
      {...props}
      onChange={onChange}
      options={props.options}
      value={selected}
    />
  );
};
