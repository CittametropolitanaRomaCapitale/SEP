import { FCC } from '@cmrc/types/FCC';
import type { SelectProps as MUISelectProps } from '@mui/material';
import MUIFormGroup from '@mui/material/FormGroup';
import MUIFormControl from '@mui/material/FormControl';
import MUIInputLabel from '@mui/material/InputLabel';
import MUIMenuItem from '@mui/material/MenuItem';
import MUISelect from '@mui/material/Select';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export type FGSelectProps = {
  readonly?: boolean;
  options?: any[];
  hiddenLabel?: boolean;
  onDeleteItem?: any;
} & MUISelectProps;

const Select: FCC<FGSelectProps> = ({
  name,
  variant,
  size,
  label,
  value,
  required,
  disabled,
  readonly,
  options,
  multiple,
  hiddenLabel,
  sx,
  onChange,
  onDeleteItem,
  ...props
}) => {
  return (
    <MUIFormGroup sx={sx ? sx : { width: '100%' }}>
      <MUIFormControl
        required={required}
        size={size}
        disabled={disabled}
        fullWidth={true}
      >
        {!hiddenLabel && (
          <MUIInputLabel variant={variant}>{label}</MUIInputLabel>
        )}
        <MUISelect
          name={name}
          variant={variant}
          size={size}
          label={label}
          value={multiple ? Array.isArray(value) ? value : [value] : value}
          disabled={disabled}
          inputProps={{ readOnly: readonly, placeholder: props?.placeholder }}
          fullWidth={true}
          multiple={multiple}
          onChange={onChange}
          renderValue={(selected: any[]) => {
            if (multiple) {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) && selected?.length > 0 && selected?.map((value) => (
                    <Chip
                      key={value}
                      label={options.filter((x) => x.value == value)[0].label}
                      size="small"
                      onDelete={() => onDeleteItem(value)}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  ))}
                </Box>
              );
            } else {
              const values = options?.filter((x) => x.value == value);
              return values?.length > 0 ? values[0].label : '';
            }
          }}
          {...props}
        >
          {!options || options?.length == 0 ? (
            <MUIMenuItem value="">
              <em>No options available</em>
            </MUIMenuItem>
          ) : (
            options?.map(({ label, value }, index) => (
              <MUIMenuItem key={index} value={value}>
                {label}
              </MUIMenuItem>
            ))
          )}
        </MUISelect>
      </MUIFormControl>
    </MUIFormGroup>
  );
};

export default Select;
