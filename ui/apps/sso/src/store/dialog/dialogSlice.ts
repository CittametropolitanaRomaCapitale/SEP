import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

const slice = createSlice({
  name: 'dialog',
  initialState: {
    dialog_id: '',
    open: false,
    content: null,
    group_content: null
  },
  reducers: {
    open: (state, action: PayloadAction<string>) => {
      state.dialog_id = action.payload;
      state.open = true;
    },
    close: (state) => {
      state.dialog_id = '';
      state.open = false;
      state.content = null;
    },
    openWithContent: (
      state,
      action: PayloadAction<{
        dialog_id: string;
        content?: { name?: string; id: number };
        group_content?: { name?: string; id: number }[];
      }>
    ) => {
      state.dialog_id = action.payload.dialog_id;
      state.content = action.payload.content;
      state.group_content = action.payload.group_content;
      state.open = true;
    }
  }
});

export const { open, close, openWithContent } = slice.actions;

// selector
export const selectDialogState = (state: RootState) => state.dialog;

export default slice.reducer;
