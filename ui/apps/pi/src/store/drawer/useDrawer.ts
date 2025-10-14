import { useAppDispatch, useAppSelector } from '../hooks';
import { open as openAction, close as closeAction } from './drawerSlice';

export const useDrawer = (args: { drawer_id: string }) => {
  const dispatch = useAppDispatch();

  const openDrawer = (): void => {
    dispatch(openAction(args?.drawer_id));
  };

  const closeDrawer = (): void => {
    dispatch(closeAction());
  };

  const isOpenDrawer = useAppSelector((state) =>
    state.drawer.drawer_id == args?.drawer_id ? state.drawer.open : false
  );

  return {
    openDrawer,
    closeDrawer,
    isOpenDrawer
  };
};
