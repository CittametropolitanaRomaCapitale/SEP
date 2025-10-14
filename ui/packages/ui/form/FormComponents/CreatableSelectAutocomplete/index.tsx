import { Fragment } from 'react';
import {
  FieldValues,
  UseFormGetValues,
  UseFormSetValue
} from 'react-hook-form';
import { AutocompleteProps as MUIAutocompleteProps, Chip } from '@mui/material';
import MUIFormControl from '@mui/material/FormControl';
import MUIAutocomplete, {
  createFilterOptions
} from '@mui/material/Autocomplete';
import MUITextField from '@mui/material/TextField';
import MUICircularProgress from '@mui/material/CircularProgress';
import { FCC } from '@cmrc/types/FCC';

export type FGCreatableSelectAutocompleteProps = {
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
  onSelect?: (event: any, setValue?: UseFormSetValue<FieldValues>) => void;
  dialogComponent?: (
    value?: any,
    setval?: (arg: any) => void,
    setValue?: UseFormSetValue<FieldValues>
  ) => JSX.Element;
} & Omit<MUIAutocompleteProps<any, any, any, any, any>, 'renderInput'>;

const filter = createFilterOptions<any>();

const CreatableSelectAutocomplete: FCC<FGCreatableSelectAutocompleteProps> = ({
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
  dialogComponent,
  multiple,
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
        multiple={multiple}
        onOpen={onOpen}
        onClose={onClose}
        onChange={onChange}
        onInputChange={onInputChange}
        options={!options || options?.length == 0 ? [] : options}
        loading={loading}
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
        freeSolo={true}
        renderTags={(val: readonly any[], getTagProps) => {
          return val
            ? val.map((option, index: number) => (
                <Chip
                  variant={variant}
                  label={option.label}
                  {...getTagProps({ index })}
                />
              ))
            : null;
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (!filtered.length && params.inputValue !== '') {
            filtered.push({
              value: params.inputValue,
              label: `Aggiungi "${params.inputValue}"`,
              isNew: true
            });
          }

          return filtered;
        }}
        getOptionLabel={(option: any) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.label;
        }}
        {...props}
      />
      {dialogComponent && dialogComponent()}
    </MUIFormControl>
  );
};

export default CreatableSelectAutocomplete;
