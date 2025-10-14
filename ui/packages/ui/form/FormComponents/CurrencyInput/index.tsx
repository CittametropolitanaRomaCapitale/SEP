import ReactNumberFormat, { NumberFormatProps } from 'react-number-format';
import type { TextFieldProps as MUITextFieldProps } from '@mui/material';
import MUITextField from '@mui/material/TextField';
import MUIFormControl from '@mui/material/FormControl';
import MUIFromGroup from '@mui/material/FormGroup';
import { FCC } from '@cmrc/types/FCC';

export type FGCurrencyInputProps = Omit<NumberFormatProps, 'size' | 'label'> & {
  value?: number;
  readonly?: boolean;
  autoComplete?: number;
  inputLeftElement?: JSX.Element;
  inputRightElement?: JSX.Element;
  onChange?: (value?: any) => void;
} & Omit<MUITextFieldProps, 'Element' | 'value' | 'onChange'>;

const CurrencyInput: FCC<FGCurrencyInputProps> = ({
  name,
  label,
  value,
  required,
  disabled,
  readonly,
  sx,
  size,
  variant,
  onChange
}) => {
  return (
    <MUIFromGroup sx={sx ? sx : { width: 1 }}>
      <MUIFormControl
        required={required}
        size={size}
        disabled={disabled}
        fullWidth={true}
      >
        <ReactNumberFormat
          name={name}
          type="text"
          readOnly={readonly}
          disabled={disabled}
          value={value}
          label={label}
          required={required}
          customInput={MUITextField}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          isNumericString
          fixedDecimalScale
          size={size}
          variant={variant}
          onValueChange={({ value: v }) => onChange?.(v)}
        />
      </MUIFormControl>
    </MUIFromGroup>
  );
};

export default CurrencyInput;
