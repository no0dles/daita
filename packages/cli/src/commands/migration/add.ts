import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import * as Listr from 'listr';
import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';
import * as fs from 'fs';
import {getMigrationRelativePath, getSchemaInformation, getSchemaLocation, SchemaLocation} from '../../utils/path';
import {
  addMigrationImport,
  addMigrationRegistration,
  getMigrationName,
  writeMigration,
} from '../../migration/generation/write-migration';
import {getRelationalMigrationSteps} from '../../migration/generation';


export default class Add extends Command {
  static description = 'adds a new migration';

  static examples = [
    `$ dc migration add initial`,
  ];

  static flags = {
    schema: flags.string({char: 's', description: 'path to schema'}),
  };

  static args = [{name: 'name'}];

  async run() {
    const {args, flags} = this.parse(Add);
    const schemaLocation = await getSchemaLocation(flags, this);

    if (!args.name) {
      const name = await cli.prompt('What the migration name?');
      await this.addMigration(schemaLocation, name);
    } else {
      await this.addMigration(schemaLocation, args.name);
    }
  }

  async addMigration(schemaLocation: SchemaLocation, name: string) {
    const schemaInfo = await getSchemaInformation(schemaLocation, this);
    if (!schemaInfo) {
      this.warn('could not load schema');
      return;
    }

    const lastMigration = schemaInfo.migrationTree.last()[0];
    const currentSchema = lastMigration ? schemaInfo.migrationTree.schema(lastMigration.id) : new DatabaseSchema();

    const tasks = new Listr([
      {
        title: 'Calculate steps',
        task: (ctx, task) => {
          const steps = getRelationalMigrationSteps(currentSchema, schemaInfo.modelSchema);
          const existing = schemaInfo.migrationTree.get(name);
          if (existing) {
            throw new Error('name already taken');
          }

          ctx.steps = steps;
        },
      },
      {
        title: 'Create migration',
        enabled: ctx => ctx.steps && ctx.steps.length > 0,
        task: ctx => {
          const sourceFile = writeMigration(name, lastMigration ? lastMigration.id : undefined, undefined, ctx.steps);
          const date = new Date();
          if (!fs.existsSync(schemaLocation.migrationDirectory)) {
            fs.mkdirSync(schemaLocation.migrationDirectory);
          }

          const migrationName = getMigrationName(name);
          const migrationFilePath = `${schemaLocation.migrationDirectory}/${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${name}.ts`;

          fs.writeFileSync(migrationFilePath, sourceFile);

          const relativePath = getMigrationRelativePath(schemaLocation.directory, migrationFilePath);
          addMigrationImport(schemaLocation.fileName, relativePath, migrationName);
          addMigrationRegistration(schemaLocation.fileName, schemaInfo.variableName, migrationName);
        },
      },
    ]);

    await tasks.run();
  }
}
