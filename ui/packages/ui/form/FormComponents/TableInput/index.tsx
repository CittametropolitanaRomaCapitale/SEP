import { ReactNode } from 'react';
import { SxProps } from '@mui/system';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MUIFormLabel from '@mui/material/FormLabel';
import MUIFromGroup from '@mui/material/FormGroup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FCC } from '@cmrc/types/FCC';
import DatePicker from '../DatePicker';
import Input from '../Input';

export type FGTableInputProps = {
  name?: string;
  label?: string | ReactNode;
  value?: any[];
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  inputs?: any[];
  sx?: SxProps;
  onChange?: (values?: any[]) => void;
};

const TableFieldInput: FCC<{
  field?: any;
  value?: any;
  onChange?: (value?: any) => void;
}> = ({ field, value, onChange }) => {
  const { type, label } = field;

  switch (type) {
    case 'date':
      return (
        <DatePicker
          size="small"
          variant="standard"
          label={label}
          value={value || null}
          onChange={onChange}
          {...field}
        />
      );

    default:
      return (
        <Input
          size="small"
          variant="standard"
          label={label}
          value={value || ''}
          onChange={(event) => onChange(event?.target?.value)}
          {...field}
        />
      );
  }
};

const TableInput: FCC<FGTableInputProps> = ({
  name,
  label,
  value,
  required,
  readonly,
  disabled,
  inputs,
  sx,
  onChange,
  ...props
}) => {
  const handleOnAdd = () => {
    const val = {};
    inputs?.map((input) => {
      val[input?.name] = '';
    });

    onChange?.([
      ...value,
      {
        ...val
      }
    ]);
  };

  const handleOnChange = (val?: any, fieldName?: string, index?: number) => {
    const data = [...value];
    data[index][fieldName] = val;
    onChange?.(data);
  };

  const handleOnDelete = (index?: number) => {
    const val = [...value];
    val?.splice(index, 1);
    onChange?.(val);
  };

  return (
    <>
      <Grid
        sx={({ palette }) => ({
          background: palette.background.default,
          borderRadius: '0.4rem',
          padding: '0 0.4rem',
          border: `1px solid ${palette.divider}`,
          minHeight: '38px'
        })}
      >
        <MUIFromGroup row={true} sx={sx ? sx : { width: 1 }}>
          <Box
            sx={(theme) => ({
              color: theme.palette.grey[900],
              fontWeight: 600,
              width: 1,
              px: 1
            })}
            {...props}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <MUIFormLabel
                disabled={disabled}
                required={required}
                sx={(theme) => ({
                  color: theme.palette.grey[900],
                  fontWeight: 600,
                  lineHeight: '1.5rem',
                  width: 1
                })}
              >
                {label}
              </MUIFormLabel>
              <Box sx={{ mt: 0.2 }}>
                <IconButton
                  size="small"
                  onClick={handleOnAdd}
                  disabled={disabled || readonly}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Stack>
          </Box>
        </MUIFromGroup>

        {value?.length > 0 && (
          <Box
            sx={({ palette }) => ({
              height: 'auto',
              overflow: 'hidden',
              borderTop: `1px solid ${palette.divider}`,
              mt: 1,
              px: 1,
              pb: 2
            })}
          >
            {value?.map((item, index) => (
              <Stack
                key={`tableInputRow_${index}`}
                direction="row"
                alignItems="center"
                sx={{ gap: 2 }}
              >
                {Object.keys(item)?.map((fieldName, itemIndex) => {
                  const field = inputs?.find(
                    (input) => input?.name === fieldName
                  );

                  if (field) {
                    return (
                      <TableFieldInput
                        key={`tableInputCell_${fieldName}_${index}_${itemIndex}`}
                        field={{ ...field, required, readonly, disabled }}
                        value={item[fieldName]}
                        onChange={(value) =>
                          handleOnChange(value, fieldName, index)
                        }
                      />
                    );
                  }
                })}

                <IconButton
                  key={`tableInputButton_${index}`}
                  size="small"
                  sx={{ mt: '16px' }}
                  disabled={disabled || readonly}
                  onClick={() => handleOnDelete(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </Box>
        )}
      </Grid>
    </>
  );
};

export default TableInput;
