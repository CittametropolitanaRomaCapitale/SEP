import { FCC } from '@cmrc/types/FCC';
import { debounce } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SelectAutocomplete from '../../FormComponents/SelectAutocomplete';
import { useFGProvider } from '../core/context';
import {
  FGHookForm,
  OverrideRequired,
  SelectAutocompleteProps
} from '../core/types';

export const FGSelectAutocomplete: FCC<
  FGHookForm<OverrideRequired<SelectAutocompleteProps<any>>>
> = ({ componentProps, type, query, optionMapping, onSelect, ...props }) => {
  const [open, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(props?.options);
  const [loading, setLoading] = useState(false);
  const { getValues, setValue, trigger, control } = useFormContext();
  const [val, setval] = useState(
    props?.value ? props?.value : componentProps?.multiple ? [] : null
  );
  const fgProviderProps = useFGProvider();

  useEffect(() => {
    if (props?.value) {
      setValue(props.name as string, props?.value);
    }
  }, []);

  /* Serve per resettare il valore dell'input */
  useEffect(() => {
    if (
      (componentProps?.multiple &&
        Array.isArray(props?.value) &&
        props?.value.length === 0) ||
      (!componentProps?.multiple && props?.value === null)
    ) {
      setval(componentProps?.multiple ? [] : null);
    }
    else if (componentProps?.multiple && Array.isArray(props?.value)) {
      setval(props?.value);
    }
    else if (!componentProps?.multiple && props?.value) {
      setval(props?.value);
    }
  }, [props?.value, componentProps?.multiple]);

  const getAsyncOptions = (value = '') => {
    setLoading(true);
    try {
      query?.(value, getValues)
        .then((data: any) => {
          if (optionMapping) setFilteredOptions(optionMapping(data));
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const onInputChange = useCallback(
    debounce((event: any, val: any, reason: any) => {
      const value = event?.target?.value;
      if (reason === 'clear' && onSelect) {
        onSelect(null, setValue);
      }
      if (query) {
        getAsyncOptions(value);
      } else {
        setFilteredOptions(filteredOptions);
      }
    }, 300),
    []
  );

  const onChange = (event: any, newValue: any) => {
    if (onSelect && newValue !== null) {
      onSelect(newValue, setValue);
    }
    setval(newValue);
    setValue(props.name as string, newValue);
    if (props.onChange) props.onChange(newValue);
    if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  const onOpen = () => {
    setOpen(true);
    if (query) {
      setLoading(true);
      getAsyncOptions();
    } else {
      setFilteredOptions(filteredOptions);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <SelectAutocomplete
      {...fgProviderProps}
      {...componentProps}
      {...props}
      options={filteredOptions}
      required={props?.required}
      value={val}
      open={open}
      loading={loading}
      onChange={onChange}
      onInputChange={onInputChange}
      onOpen={onOpen}
      onClose={onClose}
    ></SelectAutocomplete>
  );
};
