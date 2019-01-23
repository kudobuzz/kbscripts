'use strict'

const spawn = require('cross-spawn')
const yargs = require('yargs-parser')
const {
  getPathToGlobalCommand,
  resolveExecutable
} = require('../common/utils')

let args = process.argv.slice(2)
const parsedAgs = yargs(args)
const executable = 'mocha'

const wasGivenFiles = parsedAgs._length > 0

const filesToApply = wasGivenFiles ? [] : [`${process.cwd()}/**/*.test.js`]

args = wasGivenFiles
  ? args.filter(arg => parsedAgs._.includes(arg) || arg.endsWith('.js'))
  : args

const config = ['--recursive', '--exclude', '**/node_modules/**']

const resolveParams = {
  pathToGlobalCommand: getPathToGlobalCommand(executable),
  moduleName: executable,
  cwd: process.cwd()
}

const result = spawn.sync(
  resolveExecutable(executable, resolveParams),
  [...config, ...filesToApply],
  { stdio: 'inherit' }
)

process.exit(result)
