import { FCC } from '@cmrc/types/FCC';
import type { TextFieldProps as MUITextFieldProps } from '@mui/material';
import MUITextField from '@mui/material/TextField';
import MUIFromGroup from '@mui/material/FormGroup';

export type FGNumberInputProps = {
  readonly?: boolean;
  autoComplete?: number;
  inputLeftElement?: JSX.Element;
  inputRightElement?: JSX.Element;
} & MUITextFieldProps;

const NumberInput: FCC<FGNumberInputProps> = ({
  name,
  type,
  label,
  value,
  required,
  readonly,
  autoComplete = 'off',
  sx,
  inputLeftElement,
  inputRightElement,
  onChange,
  onBlur,
  ...props
}) => {
  return (
    <MUIFromGroup row={true} sx={sx ? sx : { width: '100%' }}>
      {inputLeftElement && inputLeftElement}
      <MUITextField
        name={name}
        type={type}
        label={label}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputProps={{ readOnly: readonly, step: '1' }}
        fullWidth={true}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {inputRightElement && inputRightElement}
    </MUIFromGroup>
  );
};

export default NumberInput;
