import { useGetMittenteFiledsQuery } from '@cmrc/services/src/app/piapi/generated';

export const useGetMittente = () => {
  const query = useGetMittenteFiledsQuery();
  return query;
};
