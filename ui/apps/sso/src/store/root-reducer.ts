import { combineReducers } from '@reduxjs/toolkit';
import { SSOApi as api } from '@cmrc/services/src/app/ssoapi/baseApi';
import TableReducer from './table/tableSlice';
import DrawerReducer from './drawer/drawerSlice';
import DialogReducer from './dialog/dialogSlice';
import FormReducer from './form/formSlice';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  table: TableReducer,
  drawer: DrawerReducer,
  dialog: DialogReducer,
  form: FormReducer
});
