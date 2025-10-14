import { FCC } from '@cmrc/types/FCC';
import type { TextFieldProps as MUITextFieldProps } from '@mui/material';

import MUITextField from '@mui/material/TextField';
import MUIFromGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';

export type FGInputProps = {
  readonly?: boolean;
  maxLength?: number;
  autoComplete?: number;
  inputLeftElement?: JSX.Element;
  inputRightElement?: JSX.Element;
  defaultValidation?: any;
} & MUITextFieldProps;

const Input: FCC<FGInputProps> = ({
  name,
  type,
  label,
  value,
  required,
  readonly,
  maxLength,
  autoComplete = 'off',
  sx,
  inputLeftElement,
  inputRightElement,
  onChange,
  defaultValidation,
  ...props
}) => {
  return (
    <MUIFromGroup row={true} sx={sx ? sx : { width: '100%' }}>
      <MUITextField
        name={name}
        type={type}
        label={label}
        value={value}
        required={required}
        autoComplete={autoComplete}
        InputProps={{
          startAdornment: inputLeftElement ? (
            <InputAdornment position="start">{inputLeftElement}</InputAdornment>
          ) : null,
          endAdornment: inputRightElement ? (
            <InputAdornment position="end">{inputRightElement}</InputAdornment>
          ) : null,
          readOnly: readonly
        }}
        inputProps={{ maxLength }}
        fullWidth={true}
        onChange={onChange}
        {...props}
      />
    </MUIFromGroup>
  );
};

export default Input;
