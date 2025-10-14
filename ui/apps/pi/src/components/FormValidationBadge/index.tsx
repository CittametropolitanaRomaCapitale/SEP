import { UseFormReturn } from 'react-hook-form';
import { SxProps } from '@mui/material';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/CheckCircle';
import Popover from '@cmrc/ui/components/Popover';
import { FCC } from '@cmrc/types/FCC';
import { usePopover } from '@cmrc/ui/components/Popover/usePopover';
import FormValidationPopover from '../FormValidationPopover';

export interface FormValidationBadgeProps {
  methods?: UseFormReturn<any>;
  sx?: SxProps;
}

const FormValidationBadge: FCC<FormValidationBadgeProps> = ({
  methods,
  sx
}) => {
  const { openPopover, closePopover, isOpenPopover, anchorElPopover } =
    usePopover();

  return (
    <Grid sx={{ display: 'inline-flex' }}>
      {Object.keys(methods.formState?.errors).length ? (
        <Box sx={sx}>
          <Chip
            label={
              Object.keys(methods.formState?.errors).length > 1
                ? `Ci sono ${
                    Object.keys(methods.formState?.errors).length
                  } errori`
                : `C'è ${Object.keys(methods.formState?.errors).length} errore`
            }
            onClick={openPopover}
            variant="outlined"
            icon={
              <ErrorIcon
                sx={(theme) => ({
                  color: `${theme.palette.error.main} !important`
                })}
              />
            }
            sx={(theme) => ({
              borderColor: theme.palette.grey[300]
            })}
          />
          <Popover
            title="Errori"
            onClose={closePopover}
            open={isOpenPopover}
            anchorEl={anchorElPopover}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
          >
            <FormValidationPopover errors={methods.formState?.errors} />
          </Popover>
        </Box>
      ) : (
        methods.formState?.isDirty &&
        methods.formState?.isValid && (
          <Box sx={sx}>
            <Chip
              label="Form Valido"
              variant="outlined"
              icon={
                <CheckIcon
                  sx={(theme) => ({
                    color: `${theme.palette.success.light} !important`
                  })}
                />
              }
              sx={(theme) => ({
                borderColor: theme.palette.grey[300]
              })}
            />
          </Box>
        )
      )}
    </Grid>
  );
};

export default FormValidationBadge;
