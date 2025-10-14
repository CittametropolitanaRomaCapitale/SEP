import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

const slice = createSlice({
  name: 'dialog',
  initialState: {
    dialog_id: '',
    open: false
  },
  reducers: {
    open: (state, action: PayloadAction<string>) => {
      state.dialog_id = action.payload;
      state.open = true;
    },
    close: (state) => {
      state.dialog_id = '';
      state.open = false;
    }
  }
});

export const { open, close } = slice.actions;

// selector
export const selectDialogState = (state: RootState) => state.dialog;

export default slice.reducer;
