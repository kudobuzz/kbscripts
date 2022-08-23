'use strict'
const spawn = require('child_process').spawnSync
const argv = require('yargs/yargs')(process.argv.slice(2))
const { log } = require('../common/logger')
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
        log('running command', 'npm', ...npmCommands)
        const result = spawn('npm', npmCommands, {
          stdio: 'inherit'
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
            path: {
              alias: 'dp'
            }
          })
          .demandOption('workspace')
          .demandOption('path')
      },
      function handler (args) {
        const workspaces = args.workspace.split(',')
        const baseDockerPath = `${process.cwd()}/${args.path}`
        log('Copying Dockerfile to ', workspaces)
        workspaces.forEach(workspace => {
          spawn('cp', [baseDockerPath, `${process.cwd()}/${workspace}`], {
            stdio: 'inherit'
          })
        })
      }
    )
    .example('$0 docker-bootstrap', 'bootstrap docker in workspaces')
    .alias('d', 'docker-bootstrap')
    .usage('Usage: $0 <command> [options]')
}

/**
 * Bootstrap workspaces
 */
const bootstrapWorkspace = () => {
  argv
    .command(
      'bootstrap',
      'bootstrap workspace',
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
        const workspaces = args.workspace.split(',')
        const copyEnvSampleToEnv = workspace => {
          const sampleEnvLocation = `${process.cwd()}/${workspace}/.env.sample`
          const destination = `${process.cwd()}/${workspace}/.env`
          log('Coping .env.sample from ', sampleEnvLocation, '> ', destination)
          spawn('cp', [sampleEnvLocation, destination], {
            stdio: 'inherit'
          })
        }

        workspaces.forEach(workspace => {
          copyEnvSampleToEnv(workspace)
        })
        const npmCommands = ['install', '-w ', ...workspaces]
        log('Running command', 'npm', ...npmCommands)
        const result = spawn('npm', npmCommands, {
          stdio: 'inherit'
        })
        process.exit(result.status)
      }
    )
    .example('$0 bootstrap', 'boo in workspaces')
    .alias('b', 'bootstrap')
    .usage('Usage: $0 <command> [options]')
}

//   Docker scripts
bootstrapDocker()
bootstrapWorkspace()

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
    'choose a command: install, ci, test, uninstall, docker-bootstrap, boostrap'
  )
  .version(packageJson.version).argv
