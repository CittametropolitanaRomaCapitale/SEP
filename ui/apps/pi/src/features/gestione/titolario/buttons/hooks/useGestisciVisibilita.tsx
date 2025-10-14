import { useRouter } from 'next/router';
import { useDispatch } from '../../../../../store';
import { setInitialData } from '../../../../../store/titolario/titolarioSlice';

export const useGestisciVisibilita = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const gestisciVisibilita = async (itemSelected) => {
    dispatch(setInitialData(itemSelected));

    const queryParams = {
      idPadre: itemSelected?.idPadre,
    };

    Object.keys(queryParams).forEach((k) =>
      (queryParams[k] == null || queryParams[k] === '') &&
      delete queryParams[k]
    );

    await router.push({ pathname: '/titolario', query: queryParams })
    router.push(`/titolario/${itemSelected?.id}`);
  };
  return { gestisciVisibilita };
}