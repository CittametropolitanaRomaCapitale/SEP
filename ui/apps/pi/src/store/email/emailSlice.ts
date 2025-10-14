import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type EmailActionType = 'FORWARD' | 'REPLY';
export type PECActionType = 'inoltraConProtocollo' | 'rispondiConProtocollo';

type EmailState = {
  emailData: any; 
  inoltraRispondi: EmailActionType | null;
  inoltraRispondiConProtocollo: PECActionType | null
};

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    emailData: null,
    inoltraRispondi: null,
    inoltraRispondiConProtocollo: null
  } as EmailState,
  reducers: {
    setEmailData: (state, action) => {
      state.emailData = action.payload;
    },
    clearEmailData: (state) => {
      state.emailData = null;
    },
    setinoltraRispondi: (state, action: PayloadAction<EmailActionType>) => {
      state.inoltraRispondi = action.payload;
    },
    setinoltraRispondiConProtocollo: (state, action: PayloadAction<PECActionType>) => {
      state.inoltraRispondiConProtocollo = action.payload;
    },
    clearInoltraRispondiConProtocollo: (state) => {
      state.inoltraRispondiConProtocollo = null;
    }
  },
});

export const { setEmailData, clearEmailData, setinoltraRispondi, setinoltraRispondiConProtocollo, clearInoltraRispondiConProtocollo } = emailSlice.actions;

export default emailSlice.reducer;
