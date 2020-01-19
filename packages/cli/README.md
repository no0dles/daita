@daita/cli
==========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@daita/cli.svg)](https://npmjs.org/package/@daita/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@daita/cli.svg)](https://npmjs.org/package/@daita/cli)
[![License](https://img.shields.io/npm/l/@daita/cli.svg)](https://github.com/no0dles/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @daita/cli
$ dc COMMAND
running command...
$ dc (-v|--version|version)
@daita/cli/0.1.1-alpha.1 darwin-x64 node-v13.3.0
$ dc --help [COMMAND]
USAGE
  $ dc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dc diagram`](#dc-diagram)
* [`dc doc`](#dc-doc)
* [`dc help [COMMAND]`](#dc-help-command)
* [`dc migration:add [NAME]`](#dc-migrationadd-name)
* [`dc migration:apply`](#dc-migrationapply)
* [`dc migration:undo [FILE]`](#dc-migrationundo-file)
* [`dc new [NAME]`](#dc-new-name)
* [`dc serve`](#dc-serve)

## `dc diagram`

create diagram for schema

```
USAGE
  $ dc diagram

OPTIONS
  -s, --schema=schema  path to schema
```

## `dc doc`

open documentation website

```
USAGE
  $ dc doc
```

## `dc help [COMMAND]`

display help for dc

```
USAGE
  $ dc help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `dc migration:add [NAME]`

adds a new migration

```
USAGE
  $ dc migration:add [NAME]

OPTIONS
  -s, --schema=schema  path to schema

EXAMPLE
  $ dc migration add initial
```

## `dc migration:apply`

apply relational migrations

```
USAGE
  $ dc migration:apply

OPTIONS
  -c, --context=context      [default: default] name of context
  -m, --migration=migration  migration id
  -s, --schema=schema        [default: src/schema.ts] path to schema
```

## `dc migration:undo [FILE]`

undo last migration

```
USAGE
  $ dc migration:undo [FILE]

OPTIONS
  -s, --schema=schema  name to print
```

## `dc new [NAME]`

creates a new project

```
USAGE
  $ dc new [NAME]

OPTIONS
  -d, --database=postgres|mysql|mongodb  database
  -l, --license=license                  license of project
  -p, --path=path                        path of project
  --npm-client=yarn|npm                  [default: npm] npm client to install dependencies
  --skip-install                         skip install of dependencies
```

## `dc serve`

serve daita api

```
USAGE
  $ dc serve

OPTIONS
  -c, --context=context      [default: default] name of context
  -m, --migration=migration  migration id
  -s, --schema=schema        [default: src/schema.ts] path to schema
  -w, --watch                watch for reload
```
<!-- commandsstop -->
