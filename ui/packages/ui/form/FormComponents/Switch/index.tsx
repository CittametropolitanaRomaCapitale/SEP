import { FCC } from '@cmrc/types/FCC';
import {
  Switch as MUISwitch,
  SwitchProps,
  Tooltip,
  FormControl as MUIFormControl
} from '@mui/material';
import { StyledSwitch } from './switchTheme';

export type FGSwitchProps = {
  readonly?: boolean;
  size?: string;
  label?: string;
  row?: boolean;
  options?: any[];
  hidden?: boolean;
  title?: string;
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
} & React.ComponentProps<typeof StyledSwitch>;

const Switch: FCC<FGSwitchProps> = ({
  size,
  value,
  checked,
  required,
  readonly,
  disabled,
  hidden,
  title,
  icon,
  checkedIcon,
  onChange
}) =>
  hidden ? null : (
      <MUIFormControl       
        size={size}
        required={required}
        disabled={disabled || readonly} 
      >
        <Tooltip title={title}>
        <StyledSwitch
            value={value}
            size={size}
            checked={checked}
            onChange={onChange}
            readOnly={readonly}
          icon={icon}
          checkedIcon={checkedIcon}
          />
        </Tooltip>
      </MUIFormControl>
);

export default Switch;
