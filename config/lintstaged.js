const {
  getPathToGlobalCommand,
  resolveKbScripts,
  resolveExecutable
} = require('../common/utils')

const kbScripts = resolveKbScripts()
const executable = 'doctoc'

const resolveParams = {
  pathToGlobalCommand: getPathToGlobalCommand(executable),
  moduleName: executable,
  cwd: process.cwd()
}

const doctoc = resolveExecutable('doctoc', resolveParams)

module.exports = {
  concurrent: false,
  linters: {
    'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add README.md'],
    '**/*.js': [`${kbScripts} format`, `${kbScripts} lint`, 'git add']
  }
}
