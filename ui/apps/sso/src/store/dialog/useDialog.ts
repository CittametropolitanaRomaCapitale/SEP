import { useAppDispatch, useAppSelector } from '../hooks';
import {
  open as openAction,
  close as closeAction,
  openWithContent as openWithContentAction
} from './dialogSlice';

export const useDialog = (args: { dialog_id: string }) => {
  const dispatch = useAppDispatch();

  const open = (): void => {
    dispatch(openAction(args?.dialog_id));
  };

  const close = (): void => {
    dispatch(closeAction());
  };

  const openWithContent = ({
    content,
    group_content
  }: {
    content?: { name?: string; id: number };
    group_content?: { name: string; id: number }[];
  }): void => {
    dispatch(
      openWithContentAction({
        dialog_id: args?.dialog_id,
        content,
        group_content
      })
    );
  };

  const isOpen = useAppSelector((state) =>
    state.dialog.dialog_id === args?.dialog_id ? state.dialog.open : false
  );

  const content = useAppSelector((state) => state.dialog.content);
  const groupContent = useAppSelector((state) => state.dialog.group_content);

  return {
    open,
    close,
    isOpen,
    openWithContent,
    content,
    groupContent
  };
};
