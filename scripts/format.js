'use strict'

const spawn = require('cross-spawn')
const yargs = require('yargs-parser')
const {
  getPathToGlobalCommand,
  resolveExecutable,
  hereRelative
} = require('../common/utils')

const executable = 'prettier-standard'

const args = process.argv.slice(2)
const parsedAgs = yargs(args)

const wasGivenFiles = parsedAgs._.length > 0

const filesToApply = wasGivenFiles ? [] : ['**/*.+(js|json|less|css|ts|tsx|md)']

const ignore = ['--ignore-path', hereRelative('../config/prettierignore')]

const config = ['--config', hereRelative('../config/prettierrc.js')]

const resolveParams = {
  pathToGlobalCommand: getPathToGlobalCommand(executable),
  moduleName: executable,
  cwd: process.cwd()
}

const result = spawn.sync(
  resolveExecutable(executable, resolveParams),
  [...config, ...args, ...ignore, ...filesToApply],
  { stdio: 'inherit' }
)

process.exit(result.status)
