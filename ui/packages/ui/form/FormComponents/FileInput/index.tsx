import { ChangeEvent, ReactNode } from 'react';
import { SxProps } from '@mui/system';
import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MUIFormLabel from '@mui/material/FormLabel';
import MUIFromGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export type FGFileInputProps = {
  name?: string;
  label?: string | ReactNode;
  subLabel?: string | ReactNode;
  required?: boolean;
  disabled?: boolean;
  file?: File;
  maxFileSize?: number; // in MB
  allowedExtensions?: string[];
  sx?: SxProps;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
};

const FileInput: FCC<FGFileInputProps> = ({
  name,
  label,
  subLabel,
  required,
  disabled,
  file,
  allowedExtensions,
  sx,
  onChange,
  onClear
}) => {
  return (
    <MUIFromGroup row={true} sx={sx ? sx : { width: '100%' }}>
      <Stack
        display="flex"
        justifyContent="space-between"
        direction="row"
        width={1}
        alignItems="center"
      >
        <Grid>
          <MUIFormLabel
            disabled={disabled}
            required={required}
            sx={(theme) => ({
              display: 'block',
              mt: 1,
              mb: '0.25rem',
              color: theme.palette.grey[900],
              fontWeight: 600,
              width: 1
            })}
          >
            {label}
          </MUIFormLabel>

          {!file && (
            <Typography
              sx={(theme) => ({
                width: 1,
                color: theme.palette.grey[700],
                fontSize: '0.75rem'
              })}
            >
              {subLabel}
            </Typography>
          )}

          {file && (
            <Typography
              sx={(theme) => ({
                width: 1,
                color: theme.palette.grey[700],
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              })}
            >
              {file?.name}
            </Typography>
          )}
        </Grid>

        <Grid>
          {!file && (
            <Button
              size="small"
              variant="outlined"
              disabled={disabled}
              sx={{ minWidth: '100px', mt: '0.5rem' }}
              component="label"
            >
              Carica file
              <input
                key={name}
                hidden
                accept={allowedExtensions?.join(', ')}
                multiple={false}
                type="file"
                onChange={onChange}
              />
            </Button>
          )}

          {file && (
            <IconButton
              sx={{ mt: '0.5rem' }}
              size="small"
              disabled={disabled}
              component="label"
              onClick={onClear}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Grid>
      </Stack>
    </MUIFromGroup>
  );
};

export default FileInput;
