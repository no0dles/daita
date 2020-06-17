import { getMigrationRelativePath, getSchemaInformation, getSchemaLocation } from '../utils/path';
import { AstContext } from '../ast/ast-context';
import { addMigrationImport, addMigrationRegistration, writeMigration } from '../migration/writing/write-migration';
import * as fs from 'fs';
import { getMigrationName } from '../migration/utils';
import { generateRelationalMigrationSteps } from '@daita/orm';

export async function addMigration(name: string, options: { cwd?: string, schema?: string }) {
  const schemaLocation = await getSchemaLocation(options);

  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    console.warn('could not load schema');
    return;
  }

  const migrationTree = schemaInfo.getMigrationTree();
  const currentSchema = migrationTree.getSchemaDescription({ backwardCompatible: false });
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
}
