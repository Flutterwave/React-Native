require('dotenv').config();
const packageInfo = require('./package-lock.json');
const logSymbols = require('log-symbols');
const {existsSync, mkdirSync} = require('fs');
const path = require('path');
const ncp = require('ncp');
const chalk = require('chalk');
const DIST_DIR = path.join(__dirname, './dist');

// logs error in particuler format to the terminal
const logError = (title, message = undefined) => {
  console.log(' ');
  if (message) {
    console.log(chalk.red.bold(title));
    console.log(logSymbols.error, chalk.red(message));
  } else {
    console.log(logSymbols.error, chalk.red(title));
  }
  console.log(' ');
}

// logs error in particuler format to the terminal
const logSuccess = (message) => {
  console.log(logSymbols.success, message);
}

/**
 * This function is responsible for installing the built library in an example
 * project within the local environment this will always run so long as the
 * RN_FLW_EXAMPLE_PROJECT environment variable is set.
 */
(function setExample() {
  const {RN_FLW_EXAMPLE_PROJECT} = process.env;
  // stop if test project is not specified
  if (!RN_FLW_EXAMPLE_PROJECT) {
    return;
  }
  // create destination directory name
  const DESTINATION = path.join(RN_FLW_EXAMPLE_PROJECT, packageInfo.name);

  // stop if dist folder does not exist
  if (!existsSync(DIST_DIR)) {
    return logError(
      'Build Not Found',
      'Please execute \'npm run build\'.'
    );
  }

  // stop if test folder does not exist
  if (!existsSync(RN_FLW_EXAMPLE_PROJECT)) {
    return logError(
      'Example Project Not Found',
      'Please add RN_FLW_EXAMPLE_PROJECT to your dot env file'
    );
  }

  // log message stating the found test project
  console.log(' ');
  console.log(chalk.green.bold('Found Example Project'));
  logSuccess('Installing build...');

  // create the react-native-flutterwave directory if it does not exist
  if (!existsSync(DESTINATION)) {
    logSuccess('Creating destination directory...');
    mkdirSync(DESTINATION);
    logSuccess('Destination directory created successfully');
  }

  // copy files
  ncp(DIST_DIR, DESTINATION, {
    stopOnErr: true,
  }, (err) => {
    // log error message
    if (err) {
      return logError('ERROR', err.message);
    }
    // log success message
    logSuccess('Library successfully installed at ' + DESTINATION + '');
    console.log(' ');
  });
})();

