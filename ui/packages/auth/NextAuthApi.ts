import jwt_decode from 'jwt-decode';
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import axios from 'axios';
import formurlencoded from 'form-urlencoded';
import type { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';

interface ILoginResponse {
  name: string;
  preferred_username: string;
  email: string;
  sub: string;
  exp: number;
  port_informer_id?: number;
  port?: number[];
  roles?: string[];
}
interface IKeycloakLoginResponse {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  'not-before-policy'?: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  scope?: string;
  session_state?: string;
  token_type?: string;
}

const now = () => Date.now() / 1000;

const parseResponse = ({
  id_token,
  access_token,
  refresh_token
}: Partial<IKeycloakLoginResponse>) => {
  
  const PARSED_TOKEN = jwt_decode<ILoginResponse>(access_token);
  const PARSED_REFRESH_TOKEN = jwt_decode<ILoginResponse>(refresh_token);

  const response = {
    user: { name: PARSED_TOKEN?.name },
    access_token,
    id_token,
    expires_at: PARSED_TOKEN.exp,
    exp: PARSED_TOKEN.exp,
    sub: PARSED_TOKEN.sub,
    refresh_token,
    refresh_expires_at: PARSED_REFRESH_TOKEN.exp
  };

  return response;
};

const refreshAccessToken = async (token) => {
  try {
    
    const response = await axios.post<IKeycloakLoginResponse>(
      `${process.env.NEXTAUTH_CLIENT_ISSUER}/protocol/openid-connect/token`,

      new URLSearchParams({
        client_id: process.env.NEXTAUTH_CLIENT_ID,
        client_secret: process.env.NEXTAUTH_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
        scope: 'openid'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.status === 200) {
      console.log('[REFRESH ACCESS TOKEN -> SUCCESS]');

      return parseResponse(response?.data);
    }

    console.log('[REFRESH ACCESS TOKEN -> ERROR]');
    throw new Error('There was an error on refresh');
  } catch (error) {
    console.log('[REFRESH ACCESS TOKEN -> ERROR]', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      id: 'my-keycloack-2',
      name: 'my-keycloack-2',
      clientId: process.env.NEXTAUTH_CLIENT_ID,
      clientSecret: process.env.NEXTAUTH_CLIENT_SECRET,
      issuer: process.env.NEXTAUTH_CLIENT_ISSUER,
      profile: (profile) => ({
        ...profile,
        id: profile.sub
      })
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 1- executed only after autenticate
      // return { error: 'AccessTokenError' };
      

      if (user && account) {
        if (
          [
            'http://sid.lan.provincia.roma.it',
            'http://sso.lan.provincia.roma.it',
            'http://ruf.lan.provincia.roma.it',
            'http://cmrc-sid-ui-develop.kube.simultech.it',
            'http://cmrc-sso-ui-develop.kube.simultech.it',
            'http://cmrc-ruf-ui-develop.kube.simultech.it',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://sid-ui-dev.kube.parsec326.cloud'
          ].indexOf(process.env.NEXTAUTH_URL) > -1
        ) {
          return parseResponse({
            // id_token: account?.id_token,
            access_token: account?.access_token,
            refresh_token: account?.refresh_token
          });
        }

        return parseResponse({
          id_token: account?.id_token,
          access_token: account?.access_token,
          refresh_token: account?.refresh_token
        });
      }

      // 2 - executed at each session request
      if (now() < token.expires_at) {
        return token;
      }

      // 3 - executed if token is expired try to refresh token
      if (now() < token.refresh_expires_at) {
        console.log('[REFRESH ACCESS TOKEN -> START]');
        return refreshAccessToken(token);
      }

      // Access token has expired, return an error
      console.log('[ACCESS TOKEN and REFRESH TOKEN-> EXPIRED THROW ERROR]');
      return { error: 'AccessTokenError' };
    },
    async session({ session, token }) {
      
      if (token) {
        if (
          [
            'http://sid.lan.provincia.roma.it',
            'http://sso.lan.provincia.roma.it',
            'http://ruf.lan.provincia.roma.it',
            'http://cmrc-sid-ui-develop.kube.simultech.it',
            'http://cmrc-sso-ui-develop.kube.simultech.it',
            'http://cmrc-ruf-ui-develop.kube.simultech.it',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://sid-ui-dev.kube.parsec326.cloud'
          ].indexOf(process.env.NEXTAUTH_URL) > -1
        ) {
          return {
            ...session,
            maintenance_mode: process.env.NEXTAUTH_UI_CLOSED_FOR_MAINTENANCE,
            message_maintenance_mode: process.env.NEXTAUTH_UI_CLOSED_FOR_MAINTENANCE_MSG,
            access_token: token?.access_token,
            // id_token: token?.id_token,
            refresh_token: token?.refresh_token,
            refresh_expires_at: token?.refresh_expires_at,
            sub: token?.sub,
            error: token?.error,
            exp: token?.exp,
            expires: token?.expires as any
          };
        }

        
        return {
          ...session,
          maintenance_mode: process.env.NEXTAUTH_UI_CLOSED_FOR_MAINTENANCE,
          message_maintenance_mode: process.env.NEXTAUTH_UI_CLOSED_FOR_MAINTENANCE_MSG,
          access_token: token?.access_token,
          id_token: token?.id_token,
          refresh_token: token?.refresh_token,
          refresh_expires_at: token?.refresh_expires_at,
          sub: token?.sub,
          error: token?.error,
          exp: token?.exp,
          expires: token?.expires as any
        };
      }

      return session;
    }
  }
});

export const logout = async (req: NextApiRequest, res) => {
  
  const session = await getSession({ req });

  const params: Partial<{
    post_logout_redirect_uri: string;
    id_token_hint: string;
    client_id: string;
  }> = {
    post_logout_redirect_uri: encodeURIComponent(process.env.NEXTAUTH_URL)
  };

  if (session?.id_token) {
    params.id_token_hint = session?.id_token as string;
  } else {
    params.client_id = process.env.NEXTAUTH_CLIENT_ID;
  }

  const queryString = Object.keys(params)
    .filter((key) => !!params[key])
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  const path = `${process.env.NEXTAUTH_CLIENT_ISSUER}/protocol/openid-connect/logout?${queryString}`;

  res.status(200).json({ path });
};

export const getPermissionToken = async (token, permissionIds: string[]) => {
  
  const options = {
    method: 'POST' as any,
    url: `${process.env.NEXTAUTH_CLIENT_ISSUER}/protocol/openid-connect/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`
    },
    data: formurlencoded({
      grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      client_id: process.env.NEXTAUTH_CLIENT_ID,
      audience: process.env.NEXTAUTH_CLIENT_ID,
      permission: permissionIds || []
    })
  };

  try {
    
    const { data } = await axios.request(options);
    const permissionToken = (data as any)?.access_token;

    return permissionToken;
  } catch (error) {
    debugger;
    console.log('PERMISSION ERROR', error?.response?.status);
    return null;
  }
};
