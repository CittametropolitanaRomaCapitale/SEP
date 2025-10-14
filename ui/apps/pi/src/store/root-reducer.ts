import { combineReducers } from '@reduxjs/toolkit';
import { SSOApi } from '@cmrc/services/src/app/ssoapi/baseApi';
import { api } from '@cmrc/services/src/app/piapi/baseApi';
import DialogReducer from './dialog/dialogSlice';
import DrawerReducer from './drawer/drawerSlice';
import TableReducer from './table/tableSlice';
import TitleReducer from './title/titleSlice';
import EmailReducer from './email/emailSlice';
import TitolarioReducer from './titolario/titolarioSlice';
import ProtocolloReducer from './protocollo/protocolloSlice';
import snackbarReducer from './snackbar/snackbarSlice';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [SSOApi.reducerPath]: SSOApi.reducer,
  email: EmailReducer,
  dialog: DialogReducer,
  drawer: DrawerReducer,
  table: TableReducer,
  title: TitleReducer,
  protocollo: ProtocolloReducer,
  snackbar: snackbarReducer,
  titolario: TitolarioReducer,
});
