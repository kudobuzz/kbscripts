'use strict'
const path = require('path')
const which = require('which')

function hereRelative (p) {
  const b = path.join(__dirname, p).replace(process.cwd(), '.')
  return b
}

const throwError = error => {
  throw error
}

function getPathToGlobalCommand (executable) {
  try {
    return which.sync(executable)
  } catch (error) {
    return null
  }
}

function resolveExecutable (executable, params) {
  try {
    const modulePackagePath = require.resolve(
      `${params.moduleName}/package.json`
    )
    const modulePackageDir = path.dirname(modulePackagePath)
    // eslint-disable-next-line security/detect-non-literal-require
    const { bin } = require(modulePackagePath)
    // eslint-disable-next-line security/detect-object-injection
    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modulePackageDir, binPath)

    return params.pathToGlobalCommand === fullPathToBin
      ? executable
      : fullPathToBin.replace(params.cwd, '.')
  } catch (error) {
    return params.pathToGlobalCommand ? executable : throwError(error)
  }
}

module.exports = {
  hereRelative,
  getPathToGlobalCommand,
  resolveExecutable
}
