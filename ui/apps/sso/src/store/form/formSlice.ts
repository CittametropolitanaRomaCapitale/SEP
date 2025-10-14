import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

const slice = createSlice({
  name: 'form',
  initialState: {
    form_id: '',
    default_values: null
  },
  reducers: {
    setDefaultValues: (
      state,
      action: PayloadAction<{
        form_id: string;
        default_values?: unknown;
      }>
    ) => {
      state.form_id = action.payload.form_id;
      state.default_values = action.payload.default_values;
    }
  }
});

export const { setDefaultValues } = slice.actions;

// selector
export const selectDialogState = (state: RootState) => state.form;

export default slice.reducer;
