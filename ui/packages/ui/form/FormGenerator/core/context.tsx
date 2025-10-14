import { createContext, useContext } from 'react';

export interface FGContextProps {
  variant: 'filled' | 'outlined' | 'standard';
  size?: 'small'; // rimosso medium per aggiornamento versione @mui/material:5.5.2 ->  5.10.10
  color?: any;
  disabled?: boolean;
  readonly?: boolean;
}

const Context = createContext<FGContextProps>({
  variant: 'outlined',
  size: 'small',
  color: 'primary',
  disabled: false,
  readonly: false
});

export const Provider = Context.Provider;

export const useFGProvider = () => useContext(Context);
