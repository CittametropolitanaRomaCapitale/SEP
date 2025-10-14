import { useGetDettaglioAnagraficaQuery } from '@cmrc/services/src/app/piapi/generated';

export const useGetDettaglioAnagrafica = (id: number) => {
  const query = useGetDettaglioAnagraficaQuery({ id }, { skip: !id });

  return query;
};
