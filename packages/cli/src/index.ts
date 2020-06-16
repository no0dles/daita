#!/usr/bin/env node

import { program } from 'commander';
import * as path from 'path';
import { cli } from 'cli-ux';
import { getRelationalDataAdapter } from './utils/data-adapter';
import { createHttpServer } from '@daita/http-server';
import { getMigrationRelativePath, getSchemaInformation, getSchemaLocation } from './utils/path';
import { AstContext } from './ast/ast-context';
import * as fs from "fs";
import { generateRelationalMigrationSteps } from '@daita/orm';
import {
  addMigrationImport,
  addMigrationRegistration,
  removeMigrationImport, removeMigrationRegistration,
  writeMigration,
} from './migration/writing/write-migration';
import { getMigrationName } from './migration/utils';
import { getClient } from '@daita/relational';
import { getMigrationContext } from '@daita/orm';

program.command('migration:undo')
  .description('undo last migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async opts => {
    const astContext = new AstContext();
    const schemaLocation = await getSchemaLocation(opts);
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
    if (!schemaInfo) {
      console.warn('could not load shcema');
      return;
    }

    const migrationTree = schemaInfo.getMigrationTree();
    const migrations = migrationTree.last();
    if (migrations.length !== 1) {
      throw new Error('only possible if one leaf migration');
    }
    const lastMigration = migrations[0];
    const migrationVariables = schemaInfo.getMigrationCalls();

    for (const migrationVariable of migrationVariables) {
      const argVariable = migrationVariable.variable;
      if (!argVariable) {
        throw new Error('undo only works with imports');
      }
      const id = argVariable.initializer?.property('id')?.stringValue;
      if (id !== lastMigration.id) {
        continue;
      }

      const migrationName = argVariable.name;
      const relativePath = getMigrationRelativePath(
        schemaLocation.fileName,
        argVariable.sourceFile.fileName,
      );
      const successImport = removeMigrationImport(
        schemaLocation.fileName,
        relativePath,
        migrationName,
      );
      const successRegistration = removeMigrationRegistration(
        schemaLocation.fileName,
        migrationName,
      );

      if (successImport && successRegistration) {
        console.log('delete migration ' + argVariable.sourceFile.fileName);
        fs.unlinkSync(argVariable.sourceFile.fileName);
      }
    }
  });

program.command('migration:apply')
  .description('applies migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async(opts) => {
    const astContext = new AstContext();
    const schemaLocation = await getSchemaLocation(opts);
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
    if (!schemaInfo) {
      console.warn('could not load schema');
      return;
    }

    const migrationTree = schemaInfo.getMigrationTree();

    const dataAdapter = await getRelationalDataAdapter(opts);
    if (!dataAdapter) {
      return;
    }

    const client = getClient(dataAdapter);
    const context = getMigrationContext(client, migrationTree);
    await context.update();
    await dataAdapter.close();
  });

program.command('migration:add <name>')
  .description('add migration')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .action(async(name, opts) => {
    const schemaLocation = await getSchemaLocation(opts);

    const astContext = new AstContext();
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
    if (!schemaInfo) {
      console.warn('could not load schema');
      return;
    }

    const migrationTree = schemaInfo.getMigrationTree();
    const currentSchema = migrationTree.getSchemaDescription({backwardCompatible: false});
    const lastMigration = migrationTree.last()[0];

    const steps = generateRelationalMigrationSteps(
      currentSchema,
      schemaInfo.getRelationalSchema(),
    );
    const existing = migrationTree.get(name);
    if (existing) {
      throw new Error('name already taken');
    }

    const sourceFile = writeMigration(
      name,
      lastMigration ? lastMigration.id : undefined,
      undefined,
      steps,
    );
    const date = new Date();
    if (!fs.existsSync(schemaLocation.migrationDirectory)) {
      fs.mkdirSync(schemaLocation.migrationDirectory, { recursive: true });
    }

    const migrationName = getMigrationName(name);
    const migrationFilePath = `${
      schemaLocation.migrationDirectory
    }/${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${name}.ts`;

    fs.writeFileSync(migrationFilePath, sourceFile);

    const relativePath = getMigrationRelativePath(
      schemaLocation.directory,
      migrationFilePath,
    );
    addMigrationImport(
      schemaLocation.fileName,
      relativePath,
      migrationName,
    );
    addMigrationRegistration(
      schemaLocation.fileName,
      schemaInfo.variableName,
      migrationName,
    );
  });

program.command('docs')
  .description('open documentation website')
  .action(async() => {
    const url = 'https://docs.daita.ch';
    await cli.open(url);
  });

program.command('diagram')
  .option('--cwd <string>', 'working directory')
  .option('-s, --schema <string>', 'schema filePath')
  .option('-f, --filename <string>', 'output svg filename')
  .description('open documentation website')
  .action(async(opts) => {
    const schemaLocation = await getSchemaLocation(opts);
    const astContext = new AstContext();
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
    if (!schemaInfo) {
      console.warn('could not load schema');
      return;
    }

    const nomnoml = require('nomnoml');

    let content =
      '#direction: right\n' +
      '#edges: rounded\n' +
      '#zoom: 2\n' +
      '#fillArrows: true\n' +
      '#leading: 1.75\n' +
      '#spacing: 90\n' +
      '#arrowSize: 0.5\n';

    const relationalSchema = schemaInfo.getRelationalSchema();
    for (const table of relationalSchema.tables) {
      content += `[${table.name}|${table.fields.map(f => `${f.name}${f.required ? '!' : ''}:${f.type}`).join(';')}]\n`;
      for (const foreignKey of table.references) {
        content += `[${table.name}] ${foreignKey.name}${foreignKey.required ? '+' : 'o'}-> [${foreignKey.table.name}]\n`;
      }
    }

    const svg = nomnoml.renderSvg(content);
    const cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
    const svgFile = path.join(cwd, opts.filename || 'docs/schema.svg');
    const svgDirectory = path.dirname(svgFile);
    if (!fs.existsSync(svgDirectory)) {
      fs.mkdirSync(svgDirectory, {recursive: true});
    }
    console.log(`Writing diagram to "${svgFile}"`);
    await fs.promises.writeFile(svgFile, svg);
  });

program.command('serve')
  .description('serve daita api')
  .option('-p, --port <number>', 'serving api port', (value) => parseInt(value, 0))
  .option('-c, --context <string>', 'context name')
  .option('--cwd <string>', 'working directory')
  .action(async(opts) => {
    process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
    if (opts.cwd) {
      process.env.NODE_CONFIG_DIR = path.join(opts.cwd, 'config');
    }

    const dataAdapter = await getRelationalDataAdapter(opts);
    if (!dataAdapter) {
      throw new Error('no relational adapter');
    }

    const app = createHttpServer({
      dataAdapter,
    });

    const port = opts.port || 8765;
    const server = app.listen(port, () => {
      console.log(`listening on http://localhost:${port}`);
    });

    process.on('SIGINT', () => {
      console.log('stopping http server');
      server?.close();
      dataAdapter?.close();
    });
  });

program.parse(process.argv);
