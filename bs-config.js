
/*
|--------------------------------------------------------------------------
| Browser-sync config file
|--------------------------------------------------------------------------
|
| For up-to-date information about the options:
|   http://www.browsersync.io/docs/options/
|
| There are more options than you see here, these are just the ones that are
| set internally. See the website for more info.
|
|
*/

const BASE_DIR = './public/';
const START_PATH = 'index.html';
const OPEN = 'external';
const PORT = 3000;


module.exports = {
  files: './public/**/*.css, ./public/**/*.js, ./public/**/*.html',
  server: {
    baseDir: BASE_DIR,
    // index: 'index.html',
  },
  // startPath: START_PATH,
  online: true,
  open: OPEN,
  proxy: false,
  port: PORT,
}
