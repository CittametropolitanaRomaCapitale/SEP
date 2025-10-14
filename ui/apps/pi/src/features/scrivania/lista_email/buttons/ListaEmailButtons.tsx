import React from 'react';
import { FCC } from '@cmrc/types/FCC';
import Stack from "@mui/material/Stack";
import { FiltriListaEmail } from "../filtri/FiltriListaEmail";
import { LayoutListaEmailButtonsProps, SyncronizzaPostaButton } from './SincronizzaPostaButton';

export interface LayoutListaEmailButtonsPropsComplete extends LayoutListaEmailButtonsProps {
  indirizziEmail: any[];
  onIndirizziSelected: (list: any[]) => void;
}

export const ListaEmailButtons: FCC<LayoutListaEmailButtonsPropsComplete> = ({ onSync, isLoading, isDisabled, onIndirizziSelected, indirizziEmail }) => (
  <Stack 
    direction={{ xs: 'column', sm: 'row', md: 'row'  }} 
    spacing={1} 
    justifyContent="flex-start" 
    alignItems={{ xs:"flex-start", sm:"flex-end"}}
  >
    <SyncronizzaPostaButton onSync={onSync} isLoading={isLoading} isDisabled={isDisabled} />
    <FiltriListaEmail onIndirizziSelected={onIndirizziSelected} indirizziEmail={indirizziEmail} />
  </Stack>
);
