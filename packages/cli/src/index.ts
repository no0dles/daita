#!/usr/bin/env node

import { program } from 'commander';
import { cli } from 'cli-ux';
import { addMigration } from './commands/add-migration';
import { undoMigration } from './commands/undo-migration';
import { applyMigration } from './commands/apply-migration';
import { diagram } from './commands/diagram';
import { serve } from './commands/serve';

program.command('migration:undo')
  .description('undo last migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async opts => {
   await undoMigration(opts)
  });

program.command('migration:apply')
  .description('applies migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async (opts) => {
    await applyMigration(opts);
  });


program.command('migration:add <name>')
  .description('add migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async (name, opts) => {
    await addMigration(name, opts);
  });

program.command('docs')
  .description('open documentation website')
  .action(async () => {
    const url = 'https://docs.daita.ch';
    await cli.open(url);
  });

program.command('diagram')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .option('-f, --filename <string>', 'output svg filename')
  .description('open documentation website')
  .action(async (opts) => {
    await diagram(opts);
  });

program.command('serve')
  .description('serve daita api')
  .option('-p, --port <number>', 'serving api port', (value) => parseInt(value, 0))
  .option('-c, --context <string>', 'context name')
  .option('--cwd <string>', 'working directory')
  .action(async (opts) => {
    await serve(opts);
  });

program.parse(process.argv);
