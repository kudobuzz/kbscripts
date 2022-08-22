'use strict'
const spawn = require('child_process').spawnSync
const argv = require('yargs/yargs')(process.argv.slice(2))
const path = require('path')
const packageJson = require('../package.json')
const workspaceConfig = require(`${process.cwd()}/package.json`)?.workspaces
if (!workspaceConfig) {
  throw new Error('No workspaces config found in package.json', workspaceConfig)
}

/**
 * Create an npm command
 */
const createNpmCommand = ({ command, alias }) => {
  argv
    .command(
      command,
      `${command} packages in workspaces`,
      function (yargs) {
        return yargs
          .options({
            workspace: {
              alias: 'w',
              default: workspaceConfig.join(',')
            }
          })
          .demandOption('workspace')
      },
      function handler (args) {
        const [command, ...packages] = args._
        const workspaces = args.workspace.split(',')
        const npmCommands = [command, ...packages, '-w ', ...workspaces]
        console.log(
          '\x1b[36m%s\x1b[0m',
          'running command',
          'npm',
          ...npmCommands
        )
        const result = spawn('npm', npmCommands, {
          stdio: 'inherit',
          shell: true
        })
        process.exit(result.status)
      }
    )
    .example(`$0 ${command}`, 'packages in workspaces')
    .alias(alias, command)
    .usage('Usage: $0 <command> [options]')
}

const bootstrapDocker = () => {
  argv
    .command(
      'docker-bootstrap',
      'bootstrap docker in workspaces',
      function (yargs) {
        return yargs
          .options({
            workspace: {
              alias: 'w',
              default: workspaceConfig.join(',')
            },
            dockerPath: {
                alias: 'dp'
            }
          })
          .demandOption('workspace').demandOption('dockerPath')
      },
      function handler (args) {
        const workspaces = args.workspace.split(',')
        const baseDockerPath = args.dockerPath
        console.log(
          '\x1b[36m%s\x1b[0m',
          'Copying Dockerfile to ', workspaces
        )
        workspaces.forEach(workspace => {
          spawn(
            'cp',
            [baseDockerPath, `${process.cwd()}/${workspace}`],
            {
              stdio: 'inherit'
            }
          )
        })
      }
    )
    .example('$0 docker-bootstrap', 'bootstrap docker in workspaces')
    .alias('d', 'docker-bootstrap')
    .usage('Usage: $0 <command> [options]')
}

//   CI scripts
bootstrapDocker()

//  npm scripts for workspaces
createNpmCommand({
  command: 'install',
  alias: 'i'
})
createNpmCommand({
  command: 'uninstall',
  alias: 'un'
})
createNpmCommand({
  command: 'ci',
  alias: 'ci'
})
createNpmCommand({
  command: 'test',
  alias: 't'
})

// start cli
argv
  .demandCommand(
    1,
    1,
    'choose a command: install, ci, test, uninstall, docker-bootstrap'
  )
  .version(packageJson.version).argv
