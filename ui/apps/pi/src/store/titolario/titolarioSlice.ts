import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TitolarioOutputDto } from '@cmrc/services/src/app/piapi/generated';

interface InitialState {
  initialData: TitolarioOutputDto
}

const initialState: InitialState = {
  initialData: null
};

const titolarioSlice = createSlice({
  name: 'titolario',
  initialState,
  reducers: {
    setInitialData: (state, action: PayloadAction<TitolarioOutputDto>) => {
      state.initialData = action.payload;
    },
    resetState: () => initialState
  }
});

export const { setInitialData, resetState } = titolarioSlice.actions;

export default titolarioSlice.reducer;