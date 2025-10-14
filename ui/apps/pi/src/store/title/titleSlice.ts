import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

const slice = createSlice({
  name: 'title',
  initialState: { pageTitle: null },
  reducers: {
    title: (state, action: PayloadAction<{ pageTitle: string }>) => {
      state.pageTitle = action.payload.pageTitle;
    },
    clear: (state) => {
      state.pageTitle = null;
    }
  }
});

export const { title, clear } = slice.actions;

export const selectTitleState = (state: RootState) => state.title;

export default slice.reducer;
