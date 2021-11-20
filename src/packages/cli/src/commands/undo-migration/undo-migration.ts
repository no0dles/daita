import { AstContext } from '../../ast/ast-context';
import { getMigrationRelativePath, getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { removeMigrationImport, removeMigrationRegistration } from '../../migration/writing/write-migration';
import * as fs from 'fs';
import { AstObjectValue } from '../../ast/ast-object-value';
import { createLogger } from '@daita/common/utils/logger';

const logger = createLogger({ package: 'cli', command: 'migration:undo' });

export async function undoMigration(options: { cwd?: string; schema?: string }) {
  const astContext = new AstContext();
  const schemaLocation = await getSchemaLocation(options);
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('could not load schema');
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
    const migrationValue = migrationVariable.value as AstObjectValue; //TODO check
    const id = migrationValue.stringProp('id');
    if (id !== lastMigration.id) {
      continue;
    }

    const migrationName = migrationVariable.name;
    const relativePath = getMigrationRelativePath(schemaLocation.fileName, migrationVariable.sourceFile.fileName);
    const successImport = removeMigrationImport(schemaLocation.fileName, relativePath, migrationName);
    const successRegistration = removeMigrationRegistration(schemaLocation.fileName, migrationName);

    if (successImport && successRegistration) {
      logger.info('delete migration ' + migrationVariable.sourceFile.fileName);
      fs.unlinkSync(migrationVariable.sourceFile.fileName);
    }
  }
}
