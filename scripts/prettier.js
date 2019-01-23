'use strict'

const spawn = require('cross-spawn')
const yargs = require('yargs-parser')
const {
  getPathToGlobalCommand,
  hereRelative,
  resolveExecutable
} = require('../common/utils')

let args = process.argv.slice(2)
const parsedAgs = yargs(args)
const executable = 'prettier-standard'

const wasGivenFiles = parsedAgs._length > 0

const filesToApply = wasGivenFiles ? [] : ['**/*.js']

args = wasGivenFiles
  ? args.filter(arg => parsedAgs._.includes(arg) || arg.endsWith('.js'))
  : args

const config = ['--config', hereRelative('../config/prettierrc.js')]

const resolveParams = {
  pathToGlobalCommand: getPathToGlobalCommand(executable),
  moduleName: executable,
  cwd: process.cwd()
}

const result = spawn.sync(
  resolveExecutable(executable, resolveParams),
  [...config, ...args, ...filesToApply],
  { stdio: 'inherit' }
)

process.exit(result)