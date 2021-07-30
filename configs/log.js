const chalk = require('chalk');

module.exports = {
   succeed: (text) => chalk.bold.green(text),
   error: (text) => chalk.bold.red(text),
};
