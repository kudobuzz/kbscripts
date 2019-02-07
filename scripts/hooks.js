'use strict'
const spawn = require('cross-spawn')
const path = require('path')

const format = spawn.sync(path.join(__dirname, '../bin/kb-scripts.js'), ['format'], { stdio: 'inherit' })
const lint = spawn.sync(path.join(__dirname, '../bin/kb-scripts.js'), ['lint'], { stdio: 'inherit' })
const status = (lint.status === 0) && (format.status === 0) ? 0 : 1

process.exit(status)
