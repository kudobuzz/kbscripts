'use strict'

const spawn = require('cross-spawn')
const which = require('which')
const path = require('path')
const yargs = require('yargs-parser')

let args = process.argv.slice(2)
const parsedAgs = yargs(args)

function hereRelative (p) {
  const b = path.join(__dirname, p).replace(process.cwd(), '.')
  return b
}
function getPathToGlobalCommand (executable) {
  try {
    return which.sync(executable)
  } catch (error) {
    return null
  }
}

const throwError = error => {
  throw error
}
const wasGivenFiles = parsedAgs._length > 0

const filesToApply = wasGivenFiles ? [] : ['.']

args = wasGivenFiles
  ? args.filter(arg => parsedAgs._.includes(arg) || arg.endsWith('.js'))
  : args

function resolveExecutable (
  executable,
  {
    pathToGlobalCommand = getPathToGlobalCommand(executable),
    moduleName = executable,
    cwd = process.cwd()
  } = {}
) {
  try {
    const modulePackagePath = require.resolve(`${moduleName}/package.json`)
    const modulePackageDir = path.dirname(modulePackagePath)
    // eslint-disable-next-line security/detect-non-literal-require
    const { bin } = require(modulePackagePath)

    // eslint-disable-next-line security/detect-object-injection
    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modulePackageDir, binPath)

    return pathToGlobalCommand === fullPathToBin
      ? executable
      : fullPathToBin.replace(cwd, '.')
  } catch (error) {
    return pathToGlobalCommand ? executable : throwError(error)
  }
}

const config = ['--config', hereRelative('../config/eslintrc.js')]

console.log(filesToApply, args)
const result = spawn.sync(
  resolveExecutable('eslint'),
  [...config, ...args, ...filesToApply],
  { stdio: 'inherit' }
)

process.exit(result)
