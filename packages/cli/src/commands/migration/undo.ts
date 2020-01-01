import {Command, flags} from '@oclif/command';
import * as Listr from 'listr';
import {
  getMigrationName,
  removeMigrationImport,
  removeMigrationRegistration,
} from '@daita/core/dist/migration/generation/write-migration';
import {getMigrationRelativePath, getSchemaInformation, getSchemaLocation} from '../../utils/path';
import * as fs from "fs";

export default class Undo extends Command {
  static description = 'undo last migration';

  static flags = {
    schema: flags.string({char: 's', description: 'name to print'}),
  };

  static args = [{name: 'file'}];

  async run() {
    const {args, flags} = this.parse(Undo);
    const schemaLocation = await getSchemaLocation(flags, this);
    const schemaInfo = await getSchemaInformation(schemaLocation, this);
    if(!schemaInfo) {
      this.warn('could not load shcema');
      return;
    }

    const migrations = schemaInfo.migrationTree.last();
    if (migrations.length !== 1) {
      throw new Error('only possible if one leaf migration');
    }
    const lastMigration = migrations[0];
    const file = schemaInfo.migrationFiles[lastMigration.id];

    const migrationName = getMigrationName(lastMigration.id);
    const relativePath = getMigrationRelativePath(schemaLocation.fileName, file.sourceFile.fileName);
    const successImport = removeMigrationImport(schemaLocation.fileName, relativePath, migrationName);
    const successRegistration = removeMigrationRegistration(schemaLocation.fileName, migrationName);

    if (successImport && successRegistration) {
      console.log('delete migration ' + file.sourceFile.fileName);
      fs.unlinkSync(file.sourceFile.fileName);
    }
  }
}
