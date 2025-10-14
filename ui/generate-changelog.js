const standardVersion = require('standard-version');

standardVersion({
  noVerify: true,
  header: '',
  releaseAs: process.env.PACKAGE_VERSION,
  path: '.',
  skip: {
    tag: true,
    commit: true
  },
  tagPrefix: process.env.TAG_PREFIX
})
  .then(() => {
    console.log('Changelog generated', process.env.PACKAGE_VERSION);
  })
  .catch((err) => {
    console.error(`standard-version failed with message: ${err.message}`);
  });
