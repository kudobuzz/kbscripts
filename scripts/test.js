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
const executable = 'mocha'

const wasGivenFiles = parsedAgs._.length > 0
const filesToApply = wasGivenFiles ? [] : [`${process.cwd()}/**/*.test.js`]

args = wasGivenFiles
  ? args.filter(arg => !parsedAgs._.includes(arg) || arg.endsWith('.js'))
  : args

const config = [
  '--recursive',
  '--exclude',
  '**/node_modules/**',
  '--opts',
  hereRelative('../config/mocha.opts')
]

const resolveParams = {
  pathToGlobalCommand: getPathToGlobalCommand(executable),
  moduleName: executable,
  cwd: process.cwd()
}
const result = spawn.sync(
  resolveExecutable(executable, resolveParams),
  [...config, ...args, ...filesToApply, ...['--exit']],
  { stdio: 'inherit' }
)

process.exit(result.status)
