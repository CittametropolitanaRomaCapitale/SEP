import { FCC } from '@cmrc/types/FCC';
import { FieldError, FieldErrorsImpl } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface FormValidationPopoverProps {
  errors?: Partial<FieldErrorsImpl<FieldError>>;
}

const FormValidationPopover: FCC<FormValidationPopoverProps> = ({ errors }) => (
  <Stack sx={{ p: 2 }}>
    {Object.values(errors).map((error: FieldError) => (
      <Typography
        sx={{ fontSize: '0.875rem' }}
        key={`error_message_${error?.ref?.name}`}
      >
        {error?.message}
      </Typography>
    ))}
  </Stack>
);

export default FormValidationPopover;
