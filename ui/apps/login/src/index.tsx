import React from 'react';
import ReactDOM from 'react-dom/client';
import { KcApp, defaultKcProps, getKcContext } from 'keycloakify';
import App from './App';
import './index.css';

const { kcContext } = getKcContext({});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {kcContext === undefined ? (
      <App />
    ) : (
      <KcApp
        kcContext={kcContext}
        {...{
          ...defaultKcProps,
          kcLoginClass: [...defaultKcProps.kcLoginClass, 'custom-login-page']
        }}
      />
    )}
  </React.StrictMode>
);
