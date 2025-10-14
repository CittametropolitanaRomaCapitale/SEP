import Dialog from '@cmrc/ui/components/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

interface SaveDialogProps {
  title?: string;
  close?: () => void;
  isOpen?: boolean;
  bodyText?: string;
  onSave?: () => void;
  isLoading?: boolean;
}

export const SaveDialog: FC<SaveDialogProps> = ({
  title,
  close,
  isOpen,
  bodyText,
  onSave,
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
              aria-label="salva"
              onClick={onSave}
              disabled={isLoading}
              loading={isLoading}
              size="small"
              variant="contained"
            >
              Salva
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </Dialog>
);
