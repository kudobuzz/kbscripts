'use strict'

const chai = require('chai')
const which = require('which')
const path = require('path')

const {
  getPathToGlobalCommand,
  hereRelative,
  resolveExecutable
} = require('./utils')

describe('Tests utils functions', () => {
  describe('Successes', () => {
    it('getPathToGlobalCommand() when executable found', async () => {
      const exec = 'node'
      const str = getPathToGlobalCommand(exec)
      chai.expect(which.sync(exec), str)
    })

    it('getPathToGlobalCommand() when executable is not found', async () => {
      const exec = 'kitugani'
      const str = getPathToGlobalCommand(exec)
      chai.expect(str, null)
    })

    it('hereRelative()', async () => {
      const base = '/some/folder'
      const relativePath = hereRelative(base)
      const expectedPath = path
        .join(__dirname, base)
        .replace(process.cwd(), '.')
      chai.expect(relativePath).to.be.equals(expectedPath)
    })

    it('resolveExecutable() test with eslint', async () => {
      const exec = 'eslint'
      const expectedOutput = 'test' // './node_modules/eslint/bin/eslint.js'
      const params = {
        pathToGlobalCommand: getPathToGlobalCommand(exec),
        moduleName: exec,
        cwd: process.cwd()
      }
      chai.expect(resolveExecutable(exec, params), expectedOutput)
    })

    it('resolveExecutable() test with prettier-standard', async () => {
      const exec = 'prettier-standard'
      const expectedOutput = './node_modules/prettier-standard/src/cli.js'
      const params = {
        pathToGlobalCommand: getPathToGlobalCommand(exec),
        moduleName: exec,
        cwd: process.cwd()
      }
      chai.expect(resolveExecutable(exec, params)).to.be.equal(expectedOutput)
    })
  })

  describe('Failures', () => {
    it('resolveExecutable() when moduleName is not a string', async () => {
      const exec = {}
      const params = {
        pathToGlobalCommand: getPathToGlobalCommand('exec'),
        moduleName: exec,
        cwd: process.cwd()
      }

      try {
        resolveExecutable('some', params)
      } catch (e) {
        chai.expect(e).to.be.instanceOf(Error)
      }
    })

    it('resolveExecutable() error when executable is not a string', async () => {
      const exec = {}
      const params = {
        pathToGlobalCommand: getPathToGlobalCommand('eslints'),
        moduleName: 'eslint',
        cwd: process.cwd()
      }
      try {
        resolveExecutable(exec, params)
      } catch (e) {
        chai.expect(e).to.be.instanceOf(Error)
      }
    })

    it('resolveExecutable() error when cwd is not a string', async () => {
      const exec = 'eslint'
      const params = {
        pathToGlobalCommand: getPathToGlobalCommand(exec),
        moduleName: exec,
        cwd: {}
      }
      try {
        resolveExecutable(exec, params)
      } catch (e) {
        chai.expect(e).to.be.instanceOf(Error)
      }
    })
  })
})
