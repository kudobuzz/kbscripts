'use strict'
const spawn = require('cross-spawn')
const {
  getPathToGlobalCommand,
  hereRelative,
  resolveExecutable
} = require('../common/utils')

const args = process.argv.slice(2)
const executable = 'lint-staged'
const config = ['--config', hereRelative('../config/lintstaged.js')]

const resolveParams = {
  pathToGlobalCommand: getPathToGlobalCommand(executable),
  moduleName: executable,
  cwd: process.cwd()
}
const result = spawn.sync(
  resolveExecutable(executable, resolveParams),
  [...config, ...args, '--debug'],
  { stdio: 'inherit' }
)

console.log(result)
process.exit(result.status)
