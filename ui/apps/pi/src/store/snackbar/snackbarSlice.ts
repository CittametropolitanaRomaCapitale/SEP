import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SnackbarMessage {
  id: string;
  message: string;
}

interface SnackbarState {
  snackBarId: string;
  open: boolean;
  message: string;
  messageQueue: SnackbarMessage[];
}

interface SnackbarPayload {
  id: string;
  message: string;
}

interface SnackbarListPayload {
  id: string;
  messageQueue: SnackbarMessage[];
}

const initialState: SnackbarState = {
  snackBarId: '',
  open: false,
  message: '',
  messageQueue: [],
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbarWithMessage: (state, action: PayloadAction<SnackbarPayload>) => {
      state.snackBarId = action.payload.id;
      state.open = true;
      state.message = action.payload.message;
    },
    openSnackbarWithList: (state, action: PayloadAction<SnackbarListPayload>) => {
      state.snackBarId = action.payload.id;
      state.open = true;
      state.messageQueue = action.payload.messageQueue;
    },
    closeSnackbar: (state) => {
      state.open = false;
    },
    resetSnackbar: () => initialState,
  },
});

export const { 
  openSnackbarWithMessage, 
  openSnackbarWithList, 
  closeSnackbar, 
  resetSnackbar 
} = snackbarSlice.actions;

export default snackbarSlice.reducer;