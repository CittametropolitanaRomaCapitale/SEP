import { FCC } from '@cmrc/types/FCC';
import Input from '@cmrc/ui/form/FormComponents/Input';
import CurrencyNumberInput from '@cmrc/ui/components/CurrencyNumberInput';

export interface TableCellInputProps {
  inputKey?: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  onChange?: (value?: string | number) => void;
}

const TableCellInput: FCC<TableCellInputProps> = ({
  inputKey,
  type = 'text',
  defaultValue,
  placeholder,
  label,
  disabled,
  readonly,
  maxLength,
  onChange
}) => (
  <>
    {type === 'currency' && (
      <CurrencyNumberInput
        key={inputKey}
        readOnly={readonly}
        value={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        size="small"
        variant="standard"
        label={label}
        maxLength={maxLength}
        onInputChange={onChange}
      />
    )}
    {type !== 'currency' && (
      <Input
        key={inputKey}
        type={type}
        readonly={readonly}
        size="small"
        variant="standard"
        value={defaultValue || ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        label={label}
        maxLength={maxLength}
      />
    )}
  </>
);

export default TableCellInput;
