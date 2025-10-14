import { AuthConsumer, AuthProvider } from '@cmrc/auth/jwt-context';
import { SelectOfficePopover } from '@cmrc/ui/components/dashboard/select-office-popover';
import { NoOfficeFoundPopover } from '@cmrc/ui/components/dashboard/no-office-found-popover';
import { Logo } from '@cmrc/ui/components/logo';
import { SplashScreen } from '@cmrc/ui/components/splash-screen';
import { CMRCThemeProvider } from '@cmrc/ui/providers/theme-provider';
import { createEmotionCache } from '@cmrc/ui/utils/create-emotion-cache';
import { ToastContainer } from '@cmrc/ui/components/Toast';
import { SessionWrapper } from '@cmrc/ui/components/SessionWrapper';
import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';

import nProgress from 'nprogress';
import { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';

type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App: FC<EnhancedAppProps> = (props) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, permissions, ...pageProps }
  } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  const { pathname } = useRouter();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>CMRC - PI</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReduxProvider store={store}>
        <AuthProvider
          session={session}
          permissions={permissions}
          path={pathname}
        >
          <CMRCThemeProvider config={{ mode: 'pi' }}>
            <ToastContainer position="bottom-left" />
            <AuthConsumer>
              {(auth) => {
                switch (auth.isInitialized) {
                  case 'COMPLETED':
                    return (
                      <SessionWrapper>
                        {getLayout(
                          <Component {...pageProps} session={session} />
                        )}
                      </SessionWrapper>
                    );
                  case 'SELECT_OFFICE':
                    return (
                      <>
                        <SelectOfficePopover hideAllOfficesOption showShortDescription />
                        {getLayout(
                          <Box
                            sx={{
                              width: '100%',
                              height: '60%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              display: 'flex'
                            }}
                          >
                            <Logo
                              sx={{
                                height: 120,
                                width: 120
                              }}
                            />
                          </Box>
                        )}
                      </>
                    );
                  case 'NO_OFFICE_FOUND':
                    return (
                      <>
                        <NoOfficeFoundPopover />
                        {getLayout(
                          <Box
                            sx={{
                              width: '100%',
                              height: '60%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              display: 'flex'
                            }}
                          >
                            <Logo
                              sx={{
                                height: 120,
                                width: 120
                              }}
                            />
                          </Box>
                        )}
                      </>
                    );
                  case 'ERROR_STATE':
                    return <Component {...pageProps} />;
                  default:
                    return <SplashScreen />;
                }
              }}
            </AuthConsumer>
          </CMRCThemeProvider>
        </AuthProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
