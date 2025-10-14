import { useEffect, useState } from 'react';
import TableInput from '../../FormComponents/TableInput';
import { useFormContext } from 'react-hook-form';
import { FGHookForm, TableInputProps, OverrideRequired } from '../core/types';
import { useFGProvider } from '../core/context';
import { FCC } from '@cmrc/types/FCC';

export const FGTableInput: FCC<
  FGHookForm<OverrideRequired<TableInputProps<any>>>
> = ({ componentProps, ...props }) => {
  const fgProviderProps = useFGProvider();
  const { setValue, trigger, control } = useFormContext();
  const [val, setVal] = useState([]);

  useEffect(() => {
    if (props?.value != undefined && props?.value !== '') {
      setValue(props.name as string, props?.value);
      setVal(props?.value);
    } else {
      setValue(props.name as string, []);
      setVal([]);
    }
  }, []);

  const onChange = (values: any[]) => {
    if (props.onChange) props.onChange(values);
    setValue(props.name as string, values);
    setVal(values);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <TableInput
      {...fgProviderProps}
      {...componentProps}
      {...props}
      value={val}
      onChange={onChange}
    />
  );
};
