import { getMigrationRelativePath, getSchemaInformation, getSchemaLocation } from '../utils/path';
import { AstContext } from '../ast/ast-context';
import { addMigrationImport, addMigrationRegistration, writeMigration } from '../migration/writing/write-migration';
import * as fs from 'fs';
import { getMigrationName } from '../migration/utils';
import { generateRelationalMigrationSteps } from '../../orm/migration/generation/generate-relational-migration-steps';

export async function addMigration(name: string, options: { cwd?: string; schema?: string }) {
  const schemaLocation = await getSchemaLocation(options);

  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    console.warn('could not load schema');
    return;
  }

  const migrationTree = schemaInfo.getMigrationTree();
  const currentSchema = migrationTree.getSchemaDescription({
    backwardCompatible: false,
  });
  const lastMigration = migrationTree.last()[0];

  const steps = generateRelationalMigrationSteps(currentSchema, schemaInfo.getRelationalSchema());
  if (steps.length === 0) {
    console.log('no changes to migrate from');
    return;
  }

  const existing = migrationTree.get(name);
  if (existing) {
    throw new Error(`migration name "${name}" is already taken`);
  }

  const sourceFile = writeMigration(name, lastMigration ? lastMigration.id : undefined, undefined, steps);
  const date = new Date();
  if (!fs.existsSync(schemaLocation.migrationDirectory)) {
    fs.mkdirSync(schemaLocation.migrationDirectory, { recursive: true });
  }

  const migrationName = getMigrationName(name);
  const padLeft = (val: number) => val.toString().padStart(2, '0');
  const migrationFilePath = `${schemaLocation.migrationDirectory}/${date.getFullYear()}-${padLeft(
    date.getMonth(),
  )}-${padLeft(date.getDay())}-${date.getHours()}${padLeft(date.getMinutes())}${padLeft(date.getSeconds())}-${name}.ts`;

  if (fs.existsSync(migrationFilePath)) {
    throw new Error(`migration "${migrationFilePath}" file already exists`);
  }

  fs.writeFileSync(migrationFilePath, sourceFile);

  const relativePath = getMigrationRelativePath(schemaLocation.directory, migrationFilePath);
  addMigrationImport(schemaLocation.fileName, relativePath, migrationName);
  addMigrationRegistration(schemaLocation.fileName, schemaInfo.variableName, migrationName);
}
