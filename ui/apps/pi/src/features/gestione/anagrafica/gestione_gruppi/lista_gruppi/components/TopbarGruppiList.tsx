import React from 'react';
import Grid from '@mui/material/Grid';
import { useOffice } from '@cmrc/auth/useOffice';
import { AddGruppo } from '../buttons/AddGruppo';

export const TopbarGruppiList = () => {

  const { isUserPIAdmin, isUserArchivista } = useOffice()

  return (
    <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
      {(isUserPIAdmin || isUserArchivista) && <AddGruppo />}
    </Grid>
  )
}