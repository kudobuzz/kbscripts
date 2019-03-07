'use strict'
const path = require('path')
const which = require('which')
const fs = require('fs')
const readPkgUp = require('read-pkg-up')

const cwd = process.cwd()
const { pkg } = readPkgUp.sync({
  cwd: fs.realpathSync(cwd)
})

function hereRelative (p) {
  return path.join(__dirname, p).replace(process.cwd(), '.')
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

function resolveKbScripts () {
  const executor = 'kbscripts'
  const path = '../bin/kb-scripts'
  const moduleName = '@kudobuzz/kbscripts'

  if (pkg.name === moduleName) {
    return require.resolve(path).replace(process.cwd(), '.')
  }

  const resolveParams = {
    pathToGlobalCommand: getPathToGlobalCommand(executor),
    moduleName,
    cwd: process.cwd()
  }

  return resolveExecutable(executor, resolveParams)
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
  resolveKbScripts,
  resolveExecutable
}
