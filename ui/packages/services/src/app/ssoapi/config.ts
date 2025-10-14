import type { ConfigFile } from '@rtk-query/codegen-openapi';

const SSO_LOCAL_API_URL = 'http://127.0.0.1:8080/q/openapi';
const SSO_DEV_API_URL =
  'https://cmrc-sso-backend-dev.kube.parsec326.cloud/q/openapi';

const config: ConfigFile = {
  schemaFile: SSO_DEV_API_URL,
  apiFile: './baseApi.ts',
  apiImport: 'SSOApi',
  outputFile: './generated.ts',
  exportName: 'SSOApi',
  hooks: true
};

export default config;
