#!/usr/bin/env node
'use strict'
const isEmpty = require('lodash/isEmpty')
const glob = require('glob')
const spawn = require('cross-spawn')
const path = require('path')

const [executor, bin, script, ...args] = process.argv
const pathToScripts = path.resolve(__dirname, '../scripts') + '/'
const scriptAvailable = glob.sync(path.join(pathToScripts, '*'))

function makeSureScriptExist (pathToScript) {
  try {
    return require.resolve(pathToScript)
  } catch (error) {
    return null
  }
}

if (script) startScript()
else {
  const scripts = scriptAvailable
    .map(path.normalize)
    .map(script =>
      script
        .replace(pathToScripts, '')
        .replace(/test/, '')
        .replace(/\.js/, '')
    )
    .filter(script=> !isEmpty(script))
    .join('\n ')
    
  const noScriptProvidedMessage = `\n Usage: ${bin} [script] [--flags] \n Available Scripts: \n ${scripts} \n\n\n\nOptions:\nAll options depend on the script. Docs will be improved eventually, but for most scripts you can assume that the args you pass will be forwarded to the respective tool that's being run under the hood.\nMay the force be with you.
`
  console.log(noScriptProvidedMessage)
}

function startScript () {
  const pathToScript = path.join(pathToScripts, script)
  const verifiedScriptPath = makeSureScriptExist(pathToScript)
  if (!verifiedScriptPath) throw new Error(`${script} not available`)

  const result = spawn.sync(executor, [verifiedScriptPath, ...args], {
    stdio: 'inherit'
  })

  process.exit(result.status)
}
