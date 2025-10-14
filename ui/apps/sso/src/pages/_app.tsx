import { FC } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { ToastContainer } from '@cmrc/ui/components/Toast';
import { Provider as ReduxProvider } from 'react-redux';

import nProgress from 'nprogress';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';

import { CMRCThemeProvider } from '@cmrc/ui/providers/theme-provider';

import { SplashScreen } from '@cmrc/ui/components/splash-screen';
import { SessionWrapper } from '@cmrc/ui/components/SessionWrapper';

import { AuthConsumer, AuthProvider } from '@cmrc/auth/jwt-context';
import { createEmotionCache } from '@cmrc/ui/utils/create-emotion-cache';

import { store } from '../store';

import '@cmrc/ui/i18n';

type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App: FC<EnhancedAppProps> = (props) => {
  const { pathname } = useRouter();
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps }
  } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>CMRC - SSO</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReduxProvider store={store}>
        <AuthProvider session={session} path={pathname}>
          <CMRCThemeProvider>
            <ToastContainer position="bottom-left" />
            <AuthConsumer>
              {(auth) => {
                switch (auth.isInitialized) {
                  case 'COMPLETED':
                  case 'SELECT_OFFICE':
                  case 'NO_OFFICE_FOUND':
                    return (
                      <SessionWrapper>
                        {getLayout(
                          <Component {...pageProps} session={session} />
                        )}
                      </SessionWrapper>
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
