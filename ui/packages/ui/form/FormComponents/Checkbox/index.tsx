import { FCC } from '@cmrc/types/FCC';
import type { CheckboxProps as MUICheckboxProps } from '@mui/material';
import MUIFormControl from '@mui/material/FormControl';
import MUICheckbox from '@mui/material/Checkbox';
import MUIFormControlLabel from '@mui/material/FormControlLabel';

export type FGCheckboxProps = {
  label?: any;
  readonly?: boolean;
} & MUICheckboxProps;

const Chekbox: FCC<FGCheckboxProps> = ({
  name,
  size,
  label,
  required,
  disabled,
  readonly,
  sx,
  onChange,
  ...props
}) => {
  return (
    <MUIFormControl size={size} required={required} disabled={disabled}>
      <MUIFormControlLabel
        value="end"
        control={
          <MUICheckbox
            name={name}
            size={size}
            required={required}
            disabled={disabled}
            inputProps={{ readOnly: readonly }}
            sx={sx}
            onChange={onChange}
            {...props}
          />
        }
        sx={{ width: label ? 'auto' : '30px' }}
        label={required ? label + ' *' : label}
        labelPlacement="end"
      />
    </MUIFormControl>
  );
};

export default Chekbox;
