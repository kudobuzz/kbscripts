'use strict'
const spawn = require('child_process').spawnSync
const argv = require('yargs/yargs')(process.argv.slice(2)).scriptName('workspace')
const { logInfo, logError } = require('../common/logger')
const packageJson = require('../package.json')

const workspaceRoot = process.cwd()

const workspaceConfig = require(`${workspaceRoot}/package.json`)?.workspaces
if (!workspaceConfig) {
  throw new Error('No workspaces config found in package.json', workspaceConfig)
}

const commonUsage = 'Usage: $0 <command> [options]'

/**
 * Copy .env.sample to .env for a workspace
 */
const deleteNodeModulesCopyEnvSample = workspace => {
  const baseLocation = `${workspaceRoot}/${workspace}`
  const sampleEnvLocation = `${baseLocation}/.env.sample`
  const destination = `${baseLocation}/.env`
  logInfo('Coping .env.sample from ', sampleEnvLocation, '> ', destination)
  spawn('cp', [sampleEnvLocation, destination], {
    stdio: 'inherit'
  })
  const nodeModulesLocation = `${baseLocation}/node_modules`
  logInfo('Deleting Nodemodules -> ', nodeModulesLocation)
  spawn('rm', ['-r', nodeModulesLocation])
}

const ensureEcosystemExists = (workspace)=>{
  const path = `${workspaceRoot}/${workspace}/ecosystem.config.js`
  try {
    require.resolve(path)
  } catch (err) {
    logError('No ecosystem.config.js found in ', path)
  }
}

const initialWorkspaceCommand = ({
  workspace,
  command
})=>{
  ensureEcosystemExists(workspace)
  spawn('pm2', [command, 'ecosystem.config.js', `--namespace=${workspace}`], {
    cwd: `${workspaceRoot}/${workspace}`,
    stdio: 'inherit',
  })
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
        const workspacesCommand = workspaces.map(
          workspace => `--workspace=${workspace}`
        )
        const npmCommands = [command, ...packages, ...workspacesCommand]
        logInfo('Running command: ', 'npm', ...npmCommands)
        const result = spawn('npm', npmCommands, {
          stdio: 'inherit'
        })
        process.exit(result.status)
      }
    )
    .example(`$0 ${command}`, 'packages in workspaces')
    .alias(alias, command)
    .usage(commonUsage)
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
        const baseDockerPath = `${workspaceRoot}/${args.path}`
        logInfo('Copying Dockerfile to ', workspaces)
        workspaces.forEach(workspace => {
          spawn('cp', [baseDockerPath, `${workspaceRoot}/${workspace}`], {
            stdio: 'inherit'
          })
        })
      }
    )
    .example('$0 docker-bootstrap', 'bootstrap docker in workspaces')
    .alias('d', 'docker-bootstrap')
    .usage(commonUsage)
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
        const workspacesCommand = workspaces.map(
          workspace => `--workspace=${workspace}`
        )
        workspaces.map(workspace => {
          deleteNodeModulesCopyEnvSample(workspace)
        })
        const npmCommands = [
          'install',
          ...workspacesCommand,
          '--legacy-peer-deps'
        ]
        logInfo('Running command: ', 'npm', ...npmCommands)
        const result = spawn('npm', npmCommands, {
          stdio: 'inherit'
        })
        process.exit(result.status)
      }
    )
    .example('$0 bootstrap', 'bootstrap workspaces')
    .alias('b', 'bootstrap')
    .usage(commonUsage)
}

/**
 * Bootstrap workspaces
 */
const applicationInstances = ({ command, alias }) => {
  argv
    .command(
      command,
      `${command} workspace applications`,
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
        workspaces.map(workspace=> initialWorkspaceCommand({
          workspace,
          command
        }))
      }
    )
    .example(`$0 ${command}`, `${command} workspace application`)
    .alias(alias, command)
    .usage(commonUsage)
}


//   Docker scripts
bootstrapDocker()
bootstrapWorkspace()
applicationInstances({
  command: 'start',
  alias: 'start'
})
applicationInstances({
  command: 'stop',
  alias: 'stop'
})



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

createNpmCommand({
  command: 'shrinkwrap',
  alias: 'shrinkwrap'
})

createNpmCommand({
  command: 'audit',
  alias: 'audit'
})




// start cli
argv
  .demandCommand(
    1,
    1,
    'choose a command: install, ci, test, uninstall, docker-bootstrap, boostrap'
  )
  .version(packageJson.version).argv
