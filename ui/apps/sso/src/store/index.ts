import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { ThunkAction } from 'redux-thunk';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import type { Action } from '@reduxjs/toolkit';
import { SSOApi as api } from '@cmrc/services/src/app/ssoapi/baseApi';
import toast from '@cmrc/ui/components/Toast';
import { errorOperations } from '@cmrc/ui/models/tables/DBError';
import { rootReducer } from './root-reducer';

export const errorHandlerMiddleware: Middleware = () => (next) => (action) => {
  if (action?.error && action?.error?.name !== 'ConditionError') {
    const { addError } = errorOperations();
    toast.error(action?.payload?.message);
    addError({
      message: action?.payload?.message,
      type: action?.meta?.arg?.endpointName,
      arguments: JSON.stringify(action?.meta?.arg?.originalArgs),
      stack: action?.payload?.stack,
      resolved: false,
      createdDate: new Date()
    });
    console.error(action?.meta?.arg?.endpointName, action?.payload?.message);
  }
  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(errorHandlerMiddleware),
  devTools: process.env.NEXT_PUBLIC_REACT_APP_ENABLE_REDUX_DEV_TOOLS === 'true'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();
