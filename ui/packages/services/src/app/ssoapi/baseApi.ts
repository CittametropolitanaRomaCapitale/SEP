import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

const prepareParams = (params) => {
  let query = new URLSearchParams();
  Object.entries(params)
    .filter(([k, v]) => !!v)
    .forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((vv) => query.append(k, vv));
      } else query.append(k, v as any);
    });
  return query.toString();
};

export const SSOApi = createApi({
  reducerPath: 'ssoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SSO_API_URL}/`,
    paramsSerializer: prepareParams,
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session) {
        headers.set('Authorization', `Bearer ${session?.access_token}`);
      }

      return headers;
    }
  }),
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true
});
