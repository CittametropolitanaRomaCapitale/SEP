import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllegatoTable } from '../../features/protocollo/allegati/hooks/useAllegatiService';

interface InitialState {
  initialData: any;
  initialAllegati: Array<AllegatoTable>;
}

const initialState: InitialState = {
  initialData: null,
  initialAllegati: []
};

const protocolloSlice = createSlice({
  name: 'protocollo',
  initialState,
  reducers: {
    setInitialData: (state, action: PayloadAction<any>) => {
      state.initialData = action.payload;
    },
    setInitialAllegati: (state, action: PayloadAction<Array<AllegatoTable>>) => {
      state.initialAllegati = action.payload;
    },
    resetState: () => initialState
  }
});

export const { setInitialData, setInitialAllegati, resetState } = protocolloSlice.actions;

export default protocolloSlice.reducer;