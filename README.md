<div align="center">
<h1>kbscripts 🛠</h1>

<p>CLI toolbox for common scripts across kudobuzz</p>
</div>

<hr />

# Problem

We have quite a number of js projects and we were finding it difficult updating tooling across these projects

# Solution

A common configuration library

# Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev @kudobuzz/kbscripts
```

# Usage

Install my running `npm install @kudobuzz/kbscripts`

## Scripts

1. `kbscripts lint [Specific files can go here and args for eslint]`

   Lints all js files in the target project.

2. `kbscripts format [Specific files can go here and other args to prettier]`  
   Format all js,md,ts,css files in the target project.

3. `kbscripts test [Specific files can go here and other args to mocha]`  
   Runs mocha on all \*.test.js files in the target project. Tests are run recursively.

## Using eslint configs to allow ides to use your configs

1. create .eslintrc.js
2. exports config from kbscripts

```
module.exports = require('./node_modules/@kudobuzz/kbscripts/config/eslintrc.js')
```
