const path = require('path');

const withTM = require('next-transpile-modules')([
  '@cmrc/ui',
  '@cmrc/services',
  '@cmrc/auth',
  '@cmrc/types'
]);

module.exports = withTM({
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: path.join(__dirname, '../../')
  }
});
