import { Fragment } from 'react';
import {
  FieldValues,
  UseFormGetValues,
  UseFormSetValue
} from 'react-hook-form';
import { AutocompleteProps as MUIAutocompleteProps, Chip } from '@mui/material';
import MUIFormControl from '@mui/material/FormControl';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUITextField from '@mui/material/TextField';
import MUICircularProgress from '@mui/material/CircularProgress';
import { FCC } from '@cmrc/types/FCC';

export type FGSelectAutocompleteProps = {
  variant?: any;
  readonly?: boolean;
  options?: any[];
  label?: string;
  required?: boolean;
  query?: (val: string, getValues?: UseFormGetValues<FieldValues>) => any;
  optionMapping?: (
    data: any
  ) =>
    | { value: string | number; label: string }[]
    | { label: string; options: { value: string | number; label: string }[] }[];
  onSelect?: (value?: any, setValue?: UseFormSetValue<FieldValues>) => void;
  renderOption?: (props: any, option: any) => JSX.Element;
} & Omit<MUIAutocompleteProps<any, any, any, any, any>, 'renderInput'>;

const SelectAutocomplete: FCC<FGSelectAutocompleteProps> = ({
  variant,
  size,
  label,
  value,
  required,
  disabled,
  readonly,
  open,
  loading,
  options,
  sx,
  onChange,
  onInputChange,
  onOpen,
  onClose,
  renderOption,
  ...props
}) => {
  return (
    <MUIFormControl
      required={required}
      size={size}
      variant={variant}
      disabled={disabled}
      sx={sx ? sx : { width: '100%' }}
    >
      <MUIAutocomplete
        size={size}
        value={value}
        disabled={disabled}
        fullWidth={true}
        readOnly={readonly}
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        onChange={onChange}
        onInputChange={onInputChange}
        options={!options || options?.length == 0 ? [] : options}
        loading={loading}
        getOptionLabel={(option: any) => {
          return option?.label !== undefined ? option?.label?.toString() : option;
        }}
        isOptionEqualToValue={(option: any, value: any) =>
          option?.value === value?.value
        }
        renderInput={(params) => (
          <MUITextField
            required={required}
            label={label}
            variant={variant}
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <MUICircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              )
            }}
          />
        )}
        renderOption={renderOption} 
        {...props}
      />
    </MUIFormControl>
  );
};

export default SelectAutocomplete;
