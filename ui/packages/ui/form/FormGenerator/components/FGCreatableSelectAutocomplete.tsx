import { FCC } from '@cmrc/types/FCC';
import { debounce } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CreatableSelectAutocomplete from '../../FormComponents/CreatableSelectAutocomplete';
import { useFGProvider } from '../core/context';
import {
  FGHookForm,
  OverrideRequired,
  CreatableSelectAutocompleteProps
} from '../core/types';

export const FGCreatableSelectAutocomplete: FCC<
  FGHookForm<OverrideRequired<CreatableSelectAutocompleteProps<any>>>
> = ({
  componentProps,
  type,
  query,
  optionMapping,
  onSelect,
  dialogComponent,
  ...props
}) => {
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
    debounce((event: any) => {
      const value = event?.target?.value;
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
      onSelect(newValue, setval, setValue);
    } else {
      setval(newValue);
      setValue(props.name as string, newValue);
    }
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
    <CreatableSelectAutocomplete
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
      dialogComponent={() => dialogComponent(getValues, setval, setValue)}
    ></CreatableSelectAutocomplete>
  );
};
