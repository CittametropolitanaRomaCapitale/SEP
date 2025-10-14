import { FC } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@cmrc/ui/components/Dialog';
import { dictionary } from './dictionary';

interface ConfermaEliminaUtenteProps {
  title?: string;
  close?: () => void;
  isOpen?: boolean;
  bodyText?: string;
  isLoading?: boolean;
  isLoadingAll?: boolean;
  onDelete?: () => void;
  onDeleteAll?: () => void;
}

export const ConfermaEliminaUtente: FC<ConfermaEliminaUtenteProps> = ({
  title,
  close,
  isOpen,
  bodyText,
  isLoading,
  isLoadingAll,
  onDelete,
  onDeleteAll
}) => (
  <Dialog
    title={title}
    maxWidth="sm"
    onClose={close}
    open={isOpen}
    fullWidth={false}
  >
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
          sx={{ mt: 2 }}
        >
          <Grid item>
            <Button onClick={close} aria-label="annulla">
              {dictionary.get('annulla')}
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              aria-label="elimina"
              onClick={onDelete}
              disabled={isLoading}
              loading={isLoading}
              size="small"
              variant="outlined"
            >
              {dictionary.get('eliminaMantieniPermessi')}
            </LoadingButton>
          </Grid>
          <Grid item>
            <LoadingButton
              aria-label="eliminaTutto"
              onClick={onDeleteAll}
              disabled={isLoadingAll}
              loading={isLoadingAll}
              size="small"
              variant="contained"
            >
              {dictionary.get('eliminaTutto')}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </Dialog>
);
