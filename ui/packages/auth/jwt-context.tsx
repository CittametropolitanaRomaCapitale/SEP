/* eslint-disable @typescript-eslint/naming-convention */
import { createContext, useContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import {
  SessionProvider,
  SessionProviderProps,
  signIn,
  signOut
} from 'next-auth/react';
import { DefaultSession } from 'next-auth';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

import type { MeBean, UserOffice } from '@cmrc/services/sso';
import { PermissionProvider } from '@4dd/authz';
import { useOffice } from './useOffice';
import { useMaintenanceEnv } from './useMaintenanceEnv';

interface State {
  isInitialized:
    | 'NOT_INITIALIZED'
    | 'ERROR_STATE'
    | 'SELECT_OFFICE'
    | 'PENDING'
    | 'COMPLETED'
    | 'NO_OFFICE_FOUND';
  isAuthenticated: boolean;
  showSelectOffice: boolean;
  user:
    | (DefaultSession['user'] & {
        username?: string;
        roles?: string;
        offices: MeBean['user_data']['userOffices'];
        officeWithPermission?: UserOffice[];
        selectedOffice?: UserOffice;
        storicOffices: MeBean['storic_offices'];
      })
    | null;
}

interface AuthContextValue extends State {
  platform: 'JWT';
  logout: () => Promise<void>;
  onSelectOffice: (office: UserOffice, closeDialog?: boolean) => void;
}

interface AuthProviderProps {
  path: string;
  children: ReactNode;
  session?: SessionProviderProps['session'] & {
    access_token?: string;
    error?: any;
    maintenance_mode?: string;
    message_maintenance_mode?: string;
  };
  permissions?: any;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isInitialized:
      | 'NOT_INITIALIZED'
      | 'ERROR_STATE'
      | 'SELECT_OFFICE'
      | 'PENDING'
      | 'COMPLETED'
      | 'NO_OFFICE_FOUND';
    isAuthenticated: boolean;
    office: UserOffice;
    user:
      | (DefaultSession['user'] & {
          username?: string;
          roles?: string;
          offices: MeBean['user_data']['userOffices'];
          officeWithPermission?: UserOffice[];
          storicOffices: MeBean['storic_offices'];
        })
      | null;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type ForceSelectOfficeAction = {
  type: 'FORCE_SELECT_OFFICE';
};
type ChangeOfficeAction = {
  type: 'CHANGE_OFFICE';
  payload: {
    office: UserOffice;
    closeDialog: boolean;
  };
};

type Action =
  | InitializeAction
  | LogoutAction
  | ChangeOfficeAction
  | ForceSelectOfficeAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: 'NOT_INITIALIZED',
  showSelectOffice: false,
  user: null
};

const mainRoles = (office: UserOffice) =>
  office?.userOfficeRoles
    ?.filter((officeRole) => officeRole?.role?.hierarchy_level === 0)
    .map((officeRole) => officeRole?.role?.full_name)
    .join(', ');

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user, office, isInitialized } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized,
      showSelectOffice: false,
      user: {
        ...user,
        selectedOffice: office,
        roles: mainRoles(office)
      }
    };
  },
  CHANGE_OFFICE: (state: State, action: ChangeOfficeAction): State => {
    const { office, closeDialog } = action.payload;
    const { user } = state;

    return {
      ...state,
      isInitialized: closeDialog ? 'COMPLETED' : 'SELECT_OFFICE',
      user: {
        ...user,
        selectedOffice: office,
        roles: mainRoles(office)
      }
    };
  },
  FORCE_SELECT_OFFICE: (state: State): State => ({
    ...state,
    showSelectOffice: true,
    isInitialized: 'SELECT_OFFICE'
  }),

  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    isInitialized: 'PENDING',
    user: null
  })
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'JWT',
  logout: () => Promise.resolve(),
  onSelectOffice: (office, close) => Promise.resolve({ office, close })
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children, session, path, permissions = [] } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cdr, setOffice, removeOffice } = useOffice();
  const {setMaintenanceMode, maintenanceMode, removeMaintenanceMode} = useMaintenanceEnv()

  const logout = async (): Promise<void> => {
    const {
      data: { path: logoutPath }
    } = await axios.get('/api/auth/logout');
    await signOut({ redirect: false });
    removeOffice();
    removeMaintenanceMode();
    dispatch({ type: 'LOGOUT' });
    window.location.href = logoutPath;
  };

  const onError = ({ type, goToSignIn } = { type: null, goToSignIn: false }) => {
    // console.log("goToSignIn", goToSignIn, "type", type);
    dispatch({
      type: 'INITIALIZE',
      payload: {
        isInitialized: 'ERROR_STATE',
        office: null,
        isAuthenticated: false,
        user: null
      }
    });

    if (session?.maintenance_mode && session?.maintenance_mode === 'yes' && type === 'under-maintenance') {
      if (path !== '/under-maintenance')
      {
        window.location.href = "/under-maintenance";
      }
      return;
    }

    if (!/404|500|505/.test(path)) {
      if (goToSignIn) {
        signIn('my-keycloack-2');
      } else {
        logout();
      }
    }
  };

  const getMe = async ({
    access_token
  }): Promise<{ data?: MeBean; error?: unknown }> => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SSO_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      return {
        data: {
          ...data,
          user_data: {
            ...data?.user_data,
            userOffices: orderBy(
              uniqBy(
                data?.user_data?.userOffices || [],
                (item) => item?.office?.code
              ),
              'office.name'
            )
          }
        }
      };
    } catch (error) {
      return { error };
    }
  };

  const onAuthentication = async () => {
    const { access_token, maintenance_mode, message_maintenance_mode } = session;
    const { data, error } = await getMe({ access_token });
    const allOffice = {
      id: 0,
      office: {
        name: 'ALL'
      }
    };

    setMaintenanceMode({message: message_maintenance_mode, enabled: maintenance_mode})

    if (maintenance_mode && maintenance_mode === 'yes') {        
      console.log("checking if user is admin", data);
      const isUserAdminVar = data.user_data?.roles?.find(
        (item) => item?.toLowerCase().indexOf('admin') >= 0
      ) !== undefined;

      if (!isUserAdminVar) {
        onError( {type: "under-maintenance", goToSignIn: false } );
        return;
        //throw new Error("under-maintenance");
      }
    }
    if (error) onError();

    const res = jwtDecode<{ roles?: string[]; name?: string }>(access_token);

    /** When we have only one office, we need to set the first and only office
     * as default and prevent showing select office dialog */

    // console.log('jwt_context env', process.env.NEXT_PUBLIC_APP_KEY);

    // const officeWithPermission = data?.user_data?.userOffices.filter(
    //   (office) =>
    //     office?.roles.length > 0 &&
    //     office.roles.filter(
    //       (role) =>
    //         role.full_name.split('_')[0] === process.env.NEXT_PUBLIC_APP_KEY
    //     ).length > 0
    // );

    /**
     * Si crea la lista di uffici dell'utente con un match fra applicazione e ruoli associati.
     */
    const officeWithPermission = data?.user_data?.userOffices.filter((office) => 
        office?.roles.length > 0 &&
        office.roles.some(
          (role) => role.full_name.split('_')[0] === process.env.NEXT_PUBLIC_APP_KEY
        )
    );

    // console.log('userOffices', data?.user_data?.userOffices);

    // console.log('filtered offices', officeWithPermission);

    /* const forceDefaultOffice =
      !cdr &&
      data?.user_data?.userOffices?.length === 1 &&
      data?.user_data?.userOffices[0]?.roles?.length > 0;

    const selectedOffice = forceDefaultOffice
      ? data?.user_data?.userOffices[0]
      : [allOffice, ...(data?.user_data?.userOffices || [])].find(
          (office) => office?.office?.name === cdr
        ); */

    const forceDefaultOffice = !cdr && officeWithPermission?.length === 1;

    const selectedOffice = forceDefaultOffice
      ? officeWithPermission[0]
      : [allOffice, ...(officeWithPermission || [])].find(
          (office) => office?.office?.name === cdr
        );

    if (forceDefaultOffice) setOffice(selectedOffice);

    let isInitialized: State['isInitialized'] = selectedOffice
      ? 'COMPLETED'
      : 'SELECT_OFFICE';
    if (officeWithPermission?.length === 0) {
      isInitialized = 'NO_OFFICE_FOUND';
    }

    dispatch({
      type: 'INITIALIZE',
      payload: {
        isInitialized,
        isAuthenticated: true,
        office: selectedOffice,
        user: {
          username: data?.user_data?.username,
          name: res?.name,
          roles: (res?.roles || []).join(', '),
          offices: uniqBy(
            data?.user_data?.userOffices || [],
            (item) => item?.office?.code
          ),
          officeWithPermission,
          storicOffices: uniqBy(
            (data?.storic_offices || [])?.filter(
              (item) =>
                !data?.user_data?.userOffices?.find(
                  (office) => office?.office?.code === item?.code
                )
            ),
            (item) => item?.code
          )
        }
      }
    });
  };

  const onSelectOffice = (office: UserOffice, closeDialog = false) => {
    setOffice(office);
    dispatch({
      type: 'CHANGE_OFFICE',
      payload: {
        office,
        closeDialog
      }
    });
  };

  const checkTokenError = () => {
    if (
      ['RefreshAccessTokenError', 'AccessTokenError'].includes(session?.error)
    ) {
      // console.log('Token error', session.error);
      onError();
    }
  };

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        if (session) {
          checkTokenError();

          onAuthentication();
        } else {
          onError({ type: null, goToSignIn: true });
        }
      } catch (err) {
        // onError({ forceRender: true });
      }
    };

    initialize();
  }, [path]);

  useEffect(() => {
    checkTokenError();
  }, [session?.error]);

  return (
    <SessionProvider session={session} refetchInterval={300}>
      <PermissionProvider permissionToken={permissions}>
        <AuthContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{
            ...state,
            platform: 'JWT',
            logout,
            onSelectOffice
          }}
        >
          {children}
        </AuthContext.Provider>
      </PermissionProvider>
    </SessionProvider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
