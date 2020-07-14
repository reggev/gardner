require('dotenv-safe').config();

// eslint-disable-next-line
const nodemon = require('nodemon');

nodemon({
  script: './src/index.js',
  ext: 'js json yaml',
  exitcrash: true,
});
