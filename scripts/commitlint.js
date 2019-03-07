'use strict'

const spawn = require('cross-spawn')
const {
  getPathToGlobalCommand,
  hereRelative,
  resolveExecutable
} = require('../common/utils')

const executable = 'commitlint'

const config = ['--config', hereRelative('../config/commitlint.config.js')]

const resolveParams = {
  pathToGlobalCommand: getPathToGlobalCommand(executable),
  moduleName: executable,
  cwd: process.cwd()
}
const result = spawn.sync(
  resolveExecutable(executable, resolveParams),
  [...config],
  { stdio: 'inherit' }
)

process.exit(result.status)
