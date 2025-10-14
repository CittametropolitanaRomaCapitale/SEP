import React from 'react';
import Grid from '@mui/material/Grid';
import CanRole from '@cmrc/ui/components/CanRole';
import { AddContatto } from '../buttons/AddContatto';
import FileUploadButton from '../buttons/ImportContatti';

export const TopbarAnagraficaList = () => (
  <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
    <CanRole roleIds={['PI_admin']} resourceIds={['pi_admin_resource']}>
      {/* Le funzionalità di Import e inserimento dei contatti sono visibili solo per gli utenti admin */}
      <FileUploadButton />
      <AddContatto />
    </CanRole>
  </Grid>
)