import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  openSnackbarWithMessage, 
  openSnackbarWithList, 
  closeSnackbar, 
  resetSnackbar, 
  SnackbarMessage
} from './snackbarSlice';

interface UseSnackbarProps {
  snackBarId: string;
}

export const useSnackbar = ({ snackBarId }: UseSnackbarProps) => {
  const dispatch = useAppDispatch();

  const openWithMessage = (message: string): void => {
    dispatch(openSnackbarWithMessage({ id: snackBarId, message }));
  };

  const openWithList = (messageQueue: SnackbarMessage[]): void => {
    dispatch(openSnackbarWithList({ id: snackBarId, messageQueue }));
  };

  const close = (): void => {
    dispatch(closeSnackbar());
  };

  const reset = (): void => {
    dispatch(resetSnackbar());
  };

  const isOpen = useAppSelector((state) =>
    state.snackbar.snackBarId === snackBarId ? state.snackbar.open : false
  );

  const currentMessage = useAppSelector((state) =>
    state.snackbar.snackBarId === snackBarId ? state.snackbar.message : ''
  );

  const currentMessageQueue = useAppSelector((state) =>
    state.snackbar.snackBarId === snackBarId ? state.snackbar.messageQueue : []
  );

  return {
    openWithMessage,
    openWithList,
    close,
    reset,
    isOpen,
    currentMessage,
    currentMessageQueue
  };
};