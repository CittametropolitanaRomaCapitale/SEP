import { FCC } from '@cmrc/types/FCC';
import type { InputLabelProps as MUIInputLabelProps } from '@mui/material';

import MUIInputLabel from '@mui/material/InputLabel';
import MUIFromGroup from '@mui/material/FormGroup';

export type FGFormLabelProps = {
  name?: string;
  label?: string;
} & MUIInputLabelProps;

const FormLabel: FCC<FGFormLabelProps> = ({ name, label, sx, ...props }) => {
  return (
    <MUIFromGroup row={true} sx={sx ? sx : { width: '100%' }}>
      <MUIInputLabel
        sx={(theme) => ({
          mt: 1,
          mb: 1,
          color: theme.palette.grey[900],
          fontWeight: 600
        })}
        {...props}
      >
        {label}
      </MUIInputLabel>
    </MUIFromGroup>
  );
};

export default FormLabel;
