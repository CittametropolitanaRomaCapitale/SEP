import { FCC } from '@cmrc/types/FCC';
import type { RadioProps as MUIRadioProps } from '@mui/material';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIFormLabel from '@mui/material/FormLabel';
import MUIRadioGroup from '@mui/material/RadioGroup';
import MUIRadio from '@mui/material/Radio';

export type FGRadioProps = {
  readonly?: boolean;
  size?: string;
  label?: string;
  row?: boolean;
  options?: any[];
} & MUIRadioProps;

const Radio: FCC<FGRadioProps> = ({
  name,
  size,
  label,
  value,
  row,
  required,
  readonly,
  disabled,
  sx,
  options,
  onChange
}) => {
  return (
    <MUIFormControl
      size={size}
      required={required}
      disabled={disabled || readonly}
    >
      <MUIFormLabel>{label}</MUIFormLabel>
      <MUIRadioGroup name={name} row={row} value={value}>
        {options?.map(({ label, value }, index: number) => (
          <MUIFormControlLabel
            key={index}
            control={
              <MUIRadio
                value={value}
                size={size}
                onChange={onChange}
                sx={sx}
                readOnly={readonly}
              />
            }
            label={label}
          />
        ))}
      </MUIRadioGroup>
    </MUIFormControl>
  );
};

export default Radio;
