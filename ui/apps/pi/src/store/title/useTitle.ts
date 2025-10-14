import { useAppDispatch, useAppSelector } from '../hooks';
import { title as titleAction, clear as clearAction } from './titleSlice';

export const useTitle = () => {
  const dispatch = useAppDispatch();

  const setTitle = (pageTitle: string): void => {
    dispatch(titleAction({ pageTitle }));
  };

  const clearTitle = (): void => {
    dispatch(clearAction());
  };

  const pageTitle: string = useAppSelector((state) => state.title?.pageTitle);

  return {
    setTitle,
    clearTitle,
    pageTitle
  };
};
