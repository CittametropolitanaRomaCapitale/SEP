import Router from 'next/router';
import { useEffect } from 'react';

export const useLeaveHandler = ({
  abortRouting,
  callback
}: {
  abortRouting: boolean;
  callback: (routePath?: string) => void;
}) => {
  useEffect(() => {
    const routeChangeStart = (routePath?: string) => {
      if (abortRouting) {
        Router.events.emit('routeChangeError');
        callback?.(routePath);

        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw 'Abort route change. Please ignore this error.';
      }
    };

    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [abortRouting, callback]);
};
