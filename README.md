<div align="center">
<h1>kbscripts 🛠</h1>

<p>CLI toolbox for common scripts across kudobuzz</p>
</div>

<hr />
# Problem

We have quite a number of js projects and we were finding it difficult updating tooling across these projects

# Solution

A common configuration library

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Scripts](#scripts)
  - [Using eslint configs to allow ides to use your configs](#using-eslint-configs-to-allow-ides-to-use-your-configs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

## Workspace

This command allow managing package installation for workspaces.

### Bootstrap

This allows you to setup all workspaces

- It copies .env.sample > .env
- It runs npm install for workspaces

**Usage**
```sh
kbscript workspace bootstrap
```

| Option    | Description                                             | Example          |
| --------- | ------------------------------------------------------- | ---------------- |
| workspace | This allows you to run a command for a single workspace | -- workspace api |

### NPM Commands

This workspace commands supports all npm installation commands `install, ci, uninstall and test`
To run a command for all workspaces use.

**Usage**

```sh
kbscript workspace {command} joi
```

Replace {command} with one of install, test, ci or uninstall

| Option    | Description                                             | Example          |
| --------- | ------------------------------------------------------- | ---------------- |
| workspace | This allows you to run a command for a single workspace | -- workspace api |

### Docker-bootsrap

This allows you to copy a base Dockerfile to all workspaces.

**Usage**
```sh
kbscript workspace docker-bootstrap --path {PATH_TO_DOCKER_FILE}
```
