import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

const slice = createSlice({
  name: 'drawer',
  initialState: {
    drawer_id: '',
    open: false
  },
  reducers: {
    open: (state, action: PayloadAction<string>) => {
      state.drawer_id = action.payload;
      state.open = true;
    },
    close: (state) => {
      state.open = false;
    }
  }
});

export const { open, close } = slice.actions;

// selector
export const selectDrawerState = (state: RootState) => state.drawer;

export default slice.reducer;
