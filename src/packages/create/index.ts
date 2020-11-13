#!/usr/bin/env node

import { program } from 'commander';
import { create, getOwnPackageJson } from './create';

program
  .name('create-data')
  .description('creates a new daita project')
  .option('-p, --project-name <string>', 'name of the project')
  .option('--adapter <string>', 'database adapter')
  .option('--npm-client <string>', 'npm client', 'npm')
  .option('--skip-install', 'skip npm install', false)
  .action(async (opts) => {
    await create(opts);
  });

program.version(getOwnPackageJson((pkg) => pkg.version));
program.parse(process.argv);
