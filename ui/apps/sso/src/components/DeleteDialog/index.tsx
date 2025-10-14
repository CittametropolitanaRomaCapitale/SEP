import Dialog from '@cmrc/ui/components/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

interface DeleteDialogProps {
  title?: string;
  close?: () => void;
  isOpen?: boolean;
  bodyText?: string;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const DeleteDialog: FC<DeleteDialogProps> = ({
  title,
  close,
  isOpen,
  bodyText,
  onDelete,
  isLoading
}) => (
  <Dialog title={title} onClose={close} open={isOpen} fullWidth={false}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography>{bodyText}</Typography>
        </Grid>
        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
          columnSpacing={1}
        >
          <Grid item>
            <Button onClick={close} aria-label="annulla">
              Annulla
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              aria-label="conferma"
              onClick={onDelete}
              disabled={isLoading}
              loading={isLoading}
              size="small"
              variant="contained"
            >
              Conferma
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </Dialog>
);
