import { FCC } from '@cmrc/types/FCC';
import type { DatePickerProps as MUIDatePickerProps } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MUILocalizationProvider from '@mui/lab/LocalizationProvider';
import MUITextField from '@mui/material/TextField';
import MUIFromGroup from '@mui/material/FormGroup';
import MUIDatePicker from '@mui/lab/DatePicker';
import itLocale from 'date-fns/locale/it';

export type FGDateProps = {
  name?: string;
  variant?: string;
  size?: string;
  required?: boolean;
  readonly?: boolean;
  sx?: any;
} & Omit<MUIDatePickerProps, 'renderInput'>;

const DatePicker: FCC<FGDateProps> = ({
  name,
  variant,
  size,
  label,
  required,
  readonly,
  value,
  sx,
  onChange,
  ...props
}) => {
  return (
    <MUIFromGroup row={true} sx={sx ? sx : { width: '100%' }}>
      <MUILocalizationProvider dateAdapter={AdapterDateFns} locale={itLocale}>
        <MUIDatePicker
          label={label}
          value={value}
          readOnly={readonly}
          onChange={(newValue) => onChange(newValue)}
          {...props}
          renderInput={(params: any) => (
            <MUITextField
              type={'date'}
              name={name}
              variant={variant}
              size={size}
              required={required}
              fullWidth={true}
              autoComplete="off"
              onKeyDown={(event) => {
                if (event.key !== 'Tab') event?.preventDefault();
              }}
              {...params}
            />
          )}
        />
      </MUILocalizationProvider>
    </MUIFromGroup>
  );
};

export default DatePicker;
