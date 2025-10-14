import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { ClientError, GraphQLClient } from 'graphql-request';
import { getSession } from 'next-auth/react';

export const PIClient = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json'
        }
    }
);

export const api = createApi({
    reducerPath: 'piApi',
    baseQuery: graphqlRequestBaseQuery<
        Partial<ClientError & { errorCode: number }>
    >({
        client: PIClient,
        prepareHeaders: async (headers, { getState }) => {
            const session = await getSession();
            if (session) {
                headers.set('Authorization', `Bearer ${session?.access_token}`);
            }

            return headers;
        },
        customErrors: ({ name, stack, response }) => {
            const { errorMessage = '', errorCode = 500 } = response?.errors?.length
                ? response?.errors[0]?.extensions
                : {};

            return {
                name,
                message: errorMessage,
                errorCode: response?.status || errorCode,
                stack
            };
        }
    }),
    endpoints: () => ({}),
    refetchOnMountOrArgChange: true
});
