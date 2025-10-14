import { FCC } from '@cmrc/types/FCC';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SearchableTextField from '../../FormComponents/SearchableTextField';
import { useFGProvider } from '../core/context';
import {
	FGHookForm,
	OverrideRequired,
	SearchableTextFieldProps,
} from '../core/types';

export const FGSearchableTextField: FCC<
	FGHookForm<OverrideRequired<SearchableTextFieldProps<any>>>
> = ({ componentProps, type, query, optionMapping, onSelect, ...props }) => {
	const [open, setOpen] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(props?.options);
	const [loading, setLoading] = useState(false);
	const { getValues, setValue, trigger, control } = useFormContext();
	const [val, setVal] = useState(
		props?.value ? props?.value : componentProps?.multiple ? [] : null
	);
	const fgProviderProps = useFGProvider();

	useEffect(() => {
    setVal(props?.value ? props?.value : []);
    if (props?.value) {
      trigger(props.name);
      if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
    }
  }, [props?.value]);

	const onChange = (event: any, newValue: any) => {
		if (onSelect && newValue !== null) {
			onSelect(newValue, setValue);
		}
		setVal(newValue);
		setValue(props.name as string, newValue);
		if (props.onChange) props.onChange(newValue);
		if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
	};

	const onReset = () => {
		setVal(componentProps?.multiple ? [] : null);
		setValue(props.name as string, componentProps?.multiple ? [] : null);
		if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
	};

	return (
		<SearchableTextField
			{...fgProviderProps}
			{...componentProps}
			{...props}
			options={filteredOptions}
			required={props?.required}
			value={val}
			open={open}
			loading={loading}
			onReset={onReset}
			onChange={onChange}
		>
		</SearchableTextField>
	);
};
