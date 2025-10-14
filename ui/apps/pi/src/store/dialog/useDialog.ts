import { useAppDispatch, useAppSelector } from '../hooks';
import { open as openAction, close as closeAction } from './dialogSlice';

export const useDialog = (args: { dialog_id: string }) => {
  const dispatch = useAppDispatch();

  const open = (): void => {
    dispatch(openAction(args?.dialog_id));
  };

  const close = (): void => {
    dispatch(closeAction());
  };

  const openWithId = (id: string) => {
    dispatch(openAction(id));
  };

  const isOpen = useAppSelector((state) =>
    state.dialog.dialog_id == args?.dialog_id ? state.dialog.open : false
  );

  return {
    open,
    close,
    openWithId,
    isOpen
  };
};
