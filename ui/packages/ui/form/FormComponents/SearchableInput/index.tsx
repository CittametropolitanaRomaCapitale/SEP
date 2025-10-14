import { ReactNode } from 'react';
import { FCC } from '@cmrc/types/FCC';
import MUIFromGroup from '@mui/material/FormGroup';
import MUITextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '../../../components/Dialog';
import { Link } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

export type FGSearchableInputProps = {
  name: string;
  label?: string;
  value?: { label?: string; value: any };
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  searchBody?: ReactNode;
  searchOpen?: boolean;
  sx?: SxProps;
  href?: string;
  onChange?: (value?: any) => void;
  onClear?: () => void;
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
};

const SearchableInput: FCC<FGSearchableInputProps> = ({
  name,
  label,
  value,
  required,
  disabled,
  readonly,
  searchBody,
  searchOpen,
  sx,
  href,
  onChange,
  onClear,
  onSearchOpen,
  onSearchClose,
  ...props
}) => (
  <>
    <MUIFromGroup row={true} sx={sx ? sx : { width: 1 }}>
      <MUITextField
        name={name}
        type="text"
        label={label}
        value={value?.label || ''}
        required={required}
        disabled={disabled}
        fullWidth={true}
        onChange={onChange}
        inputProps={{ readOnly: true }}
        InputProps={{
          endAdornment: (
            <Stack direction="row">
              {href && value && value.label && (
                <IconButton
                  style={{ marginBottom: -5 }} /* Regola la posizione di OpenInView */
                  disabled={disabled}
                  size="small"
                  component="label"
                >
                  <Link href={`${href}/${value?.label}`} target="_blank">
                    <OpenInNew/>
                  </Link>
                </IconButton>
              )}
              
              {value && (
                <IconButton
                  disabled={disabled}
                  size="small"
                  component="label"
                  onClick={onClear}
                >
                  <ClearIcon />
                </IconButton>
              )}

              <IconButton
                disabled={disabled}
                size="small"
                component="label"
                onClick={onSearchOpen}
              >
                <SearchIcon />
              </IconButton>
            </Stack>
          ),
          readOnly: readonly
        }}
        {...props}
      />
    </MUIFromGroup>

    <Dialog open={searchOpen} title="Cerca" onClose={onSearchClose}>
      {searchBody}
    </Dialog>
  </>
);

export default SearchableInput;
