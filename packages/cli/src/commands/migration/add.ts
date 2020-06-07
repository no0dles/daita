import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as Listr from 'listr';
import * as fs from 'fs';
import {
  getMigrationRelativePath,
  getSchemaInformation,
  getSchemaLocation,
  SchemaLocation,
} from '../../utils/path';
import { AstContext } from '../../ast/ast-context';
import {
  addMigrationImport,
  addMigrationRegistration,
  writeMigration,
} from '../../migration/writing/write-migration';
import { getMigrationName } from '../../migration/utils';
import { generateRelationalMigrationSteps } from '@daita/orm';

export default class Add extends Command {
  static description = 'adds a new migration';

  static examples = [`$ dc migration add initial`];

  static flags = {
    schema: flags.string({ char: 's', description: 'path to schema' }),
    cwd: flags.string({ description: 'working directory', default: '.' }),
  };

  static args = [{ name: 'name' }];

  async run() {
    const { args, flags } = this.parse(Add);
    const schemaLocation = await getSchemaLocation(flags, this);

    if (!args.name) {
      const name = await cli.prompt('What the migration name?');
      await this.addMigration(schemaLocation, name);
    } else {
      await this.addMigration(schemaLocation, args.name);
    }
  }

  async addMigration(schemaLocation: SchemaLocation, name: string) {
    const astContext = new AstContext();
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation, this);
    if (!schemaInfo) {
      this.warn('could not load schema');
      return;
    }

    const migrationTree = schemaInfo.getMigrationTree();
    const currentSchema = migrationTree.getSchemaDescription({backwardCompatible: false});
    const lastMigration = migrationTree.last()[0];

    const tasks = new Listr([
      {
        title: 'Calculate steps',
        task: (ctx, task) => {
          const steps = generateRelationalMigrationSteps(
            currentSchema,
            schemaInfo.getRelationalSchema(),
          );
          const existing = migrationTree.get(name);
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
          const sourceFile = writeMigration(
            name,
            lastMigration ? lastMigration.id : undefined,
            undefined,
            ctx.steps,
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
        },
      },
    ]);

    await tasks.run();
  }
}
