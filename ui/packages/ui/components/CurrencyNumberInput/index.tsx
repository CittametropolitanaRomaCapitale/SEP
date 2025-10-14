import ReactNumberFormat, { NumberFormatProps } from 'react-number-format';
import MUITextField from '@mui/material/TextField';
import { FCC } from '@cmrc/types/FCC';

const CurrencyNumberInput: FCC<
  Omit<NumberFormatProps, 'size' | 'label'> & {
    inputKey?: string;
    readonly?: boolean;
    label?: string;
    size?: 'medium' | 'small';
    variant?: 'filled' | 'outlined' | 'standard';
    onInputChange?: (value: any) => void;
  }
> = ({
  inputKey,
  readonly,
  size,
  variant,
  value,
  onInputChange,
  customInput,
  color,
  ...props
}) => {
  return (
    <ReactNumberFormat
      key={inputKey}
      type="text"
      readOnly={readonly}
      value={value}
      customInput={MUITextField}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      isNumericString
      fixedDecimalScale
      size={size}
      variant={variant}
      onValueChange={({ value: v }) => onInputChange(v)}
      {...props}
    />
  );
};

export default CurrencyNumberInput;
