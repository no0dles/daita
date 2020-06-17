import { AstContext } from '../ast/ast-context';
import { getMigrationRelativePath, getSchemaInformation, getSchemaLocation } from '../utils/path';
import { removeMigrationImport, removeMigrationRegistration } from '../migration/writing/write-migration';
import * as fs from "fs";

export async function undoMigration(options: { cwd?: string, schema?: string }) {
  const astContext = new AstContext();
  const schemaLocation = await getSchemaLocation(options);
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
}
