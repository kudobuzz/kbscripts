'use strict'

const chalk = require('chalk')

const logInfo = (...args) => console.log('\n', chalk.white('==>', ...args))

const logError = (...args) => {
  console.error(chalk.red('==>', ...args))
  process.exit(1)
}

module.exports = {
  logInfo,
  logError
}
