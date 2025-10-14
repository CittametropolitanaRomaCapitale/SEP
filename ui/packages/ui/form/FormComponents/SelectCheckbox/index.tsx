import { FCC } from '@cmrc/types/FCC';
import { SelectProps as MUISelectProps } from '@mui/material';
import MUIFormGroup from '@mui/material/FormGroup';
import MUIFormControl from '@mui/material/FormControl';
import MUIInputLabel from '@mui/material/InputLabel';
import MUIMenuItem from '@mui/material/MenuItem';
import MUISelect from '@mui/material/Select';
import MUICheckbox from '@mui/material/Checkbox';
import MUIListItemText from '@mui/material/ListItemText';

export type FGSelectCheckboxProps = {
  readonly?: boolean;
  options?: any[];
  hiddenLabel?: boolean;
  onDeleteItem?: any;
  value?: any;
} & MUISelectProps;

const SelectCheckbox: FCC<FGSelectCheckboxProps> = ({
  name,
  variant,
  size,
  label,
  value,
  required,
  disabled,
  readonly,
  options,
  multiple = true,
  sx,
  hiddenLabel,
  onChange,
  onDeleteItem,
  ...props
}) => {
  const componentValue = value ? [value] : [];

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
          value={componentValue}
          disabled={disabled}
          inputProps={{ readOnly: readonly, placeholder: props?.placeholder }}
          fullWidth={true}
          multiple={multiple}
          onChange={onChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: '300px'
              }
            }
          }}
          renderValue={(selected: any[]) => selected.join(', ')}
          {...props}
        >
          {!options || options?.length == 0 ? (
            <MUIMenuItem value="">
              <em>No options available</em>
            </MUIMenuItem>
          ) : (
            options?.map(
              ({ label: optionLabel, value: optionValue }, index) => (
                <MUIMenuItem
                  key={`${name}_${index}`}
                  value={optionValue}
                  disabled={
                    componentValue?.length > 0 &&
                    !componentValue?.includes(optionValue)
                  }
                  sx={{ maxHeight: '33px' }}
                >
                  <MUICheckbox
                    key={`${name}_${index}_checkbox`}
                    checked={componentValue?.includes(optionValue)}
                  />
                  <MUIListItemText primary={optionLabel} />
                </MUIMenuItem>
              )
            )
          )}
        </MUISelect>
      </MUIFormControl>
    </MUIFormGroup>
  );
};

export default SelectCheckbox;
