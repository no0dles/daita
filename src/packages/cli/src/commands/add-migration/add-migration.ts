import { getMigrationRelativePath, getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { AstContext } from '../../ast/ast-context';
import { addMigrationImport, addMigrationRegistration, writeMigration } from '../../migration/writing/write-migration';
import * as fs from 'fs';
import { getMigrationName } from '../../migration/utils';
import { generateMigration } from '@daita/orm';
import { createLogger } from '@daita/common';
import { getMigrationTreeSchema } from '@daita/orm';

const logger = createLogger({ package: 'cli', command: 'migration:add' });
export async function addMigration(name: string, options: { cwd?: string; schema?: string }) {
  const schemaLocation = await getSchemaLocation(options);

  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('could not load schema');
  }

  const migrationTree = schemaInfo.getMigrationTree();
  const currentSchema = getMigrationTreeSchema(migrationTree);
  const lastMigration = migrationTree.last()[0];

  const existing = migrationTree.get(name);
  if (existing) {
    throw new Error(`migration name "${name}" is already taken`);
  }

  const newMigration = generateMigration(currentSchema, schemaInfo.getRelationalSchema(), {
    id: name,
    after: lastMigration ? lastMigration.id : undefined,
    resolve: undefined,
  });

  if (newMigration.upMigration.length === 0) {
    logger.info('there are no pending changes');
    return;
  }

  const sourceFile = writeMigration(newMigration);
  const date = new Date();
  if (!fs.existsSync(schemaLocation.migrationDirectory)) {
    fs.mkdirSync(schemaLocation.migrationDirectory, { recursive: true });
  }

  const migrationName = getMigrationName(name);
  const padLeft = (val: number) => val.toString().padStart(2, '0');
  const migrationFilePath = `${schemaLocation.migrationDirectory}/${date.getFullYear()}-${padLeft(
    date.getMonth() + 1,
  )}-${padLeft(date.getDate())}-${date.getHours()}${padLeft(date.getMinutes())}${padLeft(
    date.getSeconds(),
  )}-${name}.ts`;

  if (fs.existsSync(migrationFilePath)) {
    throw new Error(`migration "${migrationFilePath}" file already exists`);
  }

  fs.writeFileSync(migrationFilePath, sourceFile);

  const relativePath = getMigrationRelativePath(schemaLocation.directory, migrationFilePath);
  addMigrationImport(schemaLocation.fileName, relativePath, migrationName);
  addMigrationRegistration(schemaLocation.fileName, schemaInfo.variableName, migrationName);
}
