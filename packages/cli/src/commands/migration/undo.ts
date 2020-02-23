import {Command, flags} from '@oclif/command';
import {
  getMigrationRelativePath,
  getSchemaInformation,
  getSchemaLocation,
} from '../../utils/path';
import {AstContext} from '../../ast/ast-context';
import {removeMigrationImport, removeMigrationRegistration} from '../../migration/writing/write-migration';
import * as fs from 'fs';

export default class Undo extends Command {
  static description = 'undo last migration';

  static flags = {
    schema: flags.string({char: 's', description: 'name to print'}),
    cwd: flags.string({description: 'working directory', default: '.'}),
  };

  static args = [];

  async run() {
    const {flags} = this.parse(Undo);
    const astContext = new AstContext();
    const schemaLocation = await getSchemaLocation(flags, this);
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation, this);
    if (!schemaInfo) {
      this.warn('could not load shcema');
      return;
    }

    const migrationTree = schemaInfo.getMigrationTree();
    const migrations = migrationTree.last();
    if (migrations.length !== 1) {
      throw new Error('only possible if one leaf migration');
    }
    const lastMigration = migrations[0];
    const migrationVariables = schemaInfo.getMigrationVariables();

    for (const migrationVariable of migrationVariables) {
      const id = migrationVariable.initializer?.property('id')?.stringValue;
      if(id !== lastMigration.id) {
        continue;
      }

      const migrationName = migrationVariable.name;
      const relativePath = getMigrationRelativePath(
        schemaLocation.fileName,
        migrationVariable.sourceFile.fileName,
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
        this.log('delete migration ' + migrationVariable.sourceFile.fileName);
        fs.unlinkSync(migrationVariable.sourceFile.fileName);
      }
    }
  }
}
