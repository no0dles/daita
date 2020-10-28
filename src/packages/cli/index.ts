#!/usr/bin/env node

import { program } from 'commander';
import { cli } from 'cli-ux';
import { addMigration } from './commands/add-migration';
import { undoMigration } from './commands/undo-migration';
import { applyMigration } from './commands/apply-migration';
import { diagram } from './commands/diagram';
import { serve } from './commands/serve';
import { generateRule } from './commands/generate-rule';
import { upgrade } from './commands/upgrade';
import { init } from './commands/init';
import { login } from './commands/login';
import { listDatabases } from './commands/list-databases';

program
  .command('init')
  .description('init configurations')
  .option('--cwd <string>', 'working directory')
  .action(async (opts) => {
    await init(opts);
  });

program
  .command('migration:undo')
  .description('undo last migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async (opts) => {
    await undoMigration(opts);
  });

program
  .command('migration:apply')
  .description('applies migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .option('-c, --context <string>', 'config context')
  .action(async (opts) => {
    await applyMigration(opts);
  });

program
  .command('migration:add <name>')
  .description('add migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async (name, opts) => {
    await addMigration(name, opts);
  });

program
  .command('rule:generate')
  .description('generate rules')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async (opts) => {
    await generateRule(opts);
  });

program
  .command('docs')
  .description('open documentation website')
  .action(async () => {
    const url = 'https://docs.daita.ch';
    await cli.open(url);
  });

program
  .command('login')
  .description('login on cloud.daita.ch')
  .action(async () => {
    await login();
  });

program
  .command('list:dbs')
  .description('list databases on cloud.daita.ch')
  .action(async () => {
    await listDatabases();
  });

program
  .command('upgrade')
  .option('--cwd <string>', 'working directory')
  .description('upgrade all daita packages')
  .action(async (opts) => {
    await upgrade(opts);
  });

program
  .command('diagram')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .option('-f, --filename <string>', 'output svg filename')
  .description('open documentation website')
  .action(async (opts) => {
    await diagram(opts);
  });

program
  .command('serve')
  .description('serve daita api')
  .option('-p, --port <number>', 'serving api port', (value) => parseInt(value, 0))
  .option('-c, --context <string>', 'config context name')
  .option('--cwd <string>', 'working directory')
  .option('--schema <string>', 'relational schema')
  .option('--disable-auth', 'disable authorization and rules', false)
  .option('--disable-watch', 'disable watching migrations and rules', false)
  .action(async (opts) => {
    await serve(opts);
  });

program.parse(process.argv);
