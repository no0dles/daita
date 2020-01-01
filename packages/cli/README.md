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
@daita/cli/0.0.4-alpha.2 darwin-x64 node-v13.3.0
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
* [`dc migration:apply [FILE]`](#dc-migrationapply-file)
* [`dc migration:undo [FILE]`](#dc-migrationundo-file)
* [`dc serve [FILE]`](#dc-serve-file)

## `dc diagram`

create diagram for schema

```
USAGE
  $ dc diagram

EXAMPLE
  $ dc hello
  hello world from ./src/hello.ts!
```

## `dc doc`

open documentation

```
USAGE
  $ dc doc

EXAMPLE
  $ dc hello
  hello world from ./src/hello.ts!
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

## `dc migration:apply [FILE]`

apply relational migrations

```
USAGE
  $ dc migration:apply [FILE]

OPTIONS
  -s, --schema=schema  path to schema

EXAMPLE
  $ dc migration undo
  hello world from ./src/hello.ts!
```

## `dc migration:undo [FILE]`

undo last migration

```
USAGE
  $ dc migration:undo [FILE]

OPTIONS
  -s, --schema=schema  name to print

EXAMPLE
  $ dc migration undo
  hello world from ./src/hello.ts!
```

## `dc serve [FILE]`

serve api

```
USAGE
  $ dc serve [FILE]

OPTIONS
  -s, --schema=schema  name to print

EXAMPLE
  $ dc hello
  hello world from ./src/hello.ts!
```
<!-- commandsstop -->
