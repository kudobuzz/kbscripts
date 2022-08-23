'use strict'

const chalk = require('chalk')

const log = (...args) => console.log(chalk.white('==>', ...args))

const error = (...args) => chalk.red('==>', ...args)

module.exports = {
  log,
  error
}
