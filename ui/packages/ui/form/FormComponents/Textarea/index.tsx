import { FCC } from '@cmrc/types/FCC';
import type { TextFieldProps as MUITextFieldProps } from '@mui/material';
import MUITextField from '@mui/material/TextField';
import MUIFromGroup from '@mui/material/FormGroup';

export type FGTextareaProps = {
  readonly?: boolean;
  inputLeftElement?: JSX.Element;
  inputRightElement?: JSX.Element;
} & MUITextFieldProps;

const Textarea: FCC<FGTextareaProps> = ({
  name,
  label,
  value,
  required,
  readonly,
  sx,
  onChange,
  ...props
}) => {
  return (
    <MUIFromGroup sx={sx ? sx : { width: '100%' }}>
      <MUITextField
        multiline
        name={name}
        label={label}
        value={value}
        required={required}
        inputProps={{ readOnly: readonly }}
        fullWidth={true}
        onChange={onChange}
        {...props}
      />
    </MUIFromGroup>
  );
};

export default Textarea;
