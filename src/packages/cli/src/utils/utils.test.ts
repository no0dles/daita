import * as path from 'path';
import { generateRelationalMigrationSteps } from '@daita/orm';
import { getSchemaInformation, SchemaLocation } from './path';
import { AstContext } from '../ast/ast-context';

export function isNotNull<T>(value: T): asserts value is NonNullable<T> {
  expect(value).not.toBeUndefined();
  expect(value).not.toBeNull();
}

export async function getMigrationSteps(fileName: string) {
  const schemaLocation: SchemaLocation = {
    fileName,
    directory: path.dirname(fileName),
    migrationDirectory: path.join(path.dirname(fileName), 'migrations'),
  };

  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('unable to get schema information');
  }

  const migrationTree = schemaInfo.getMigrationTree();
  const currentSchema = migrationTree.getSchemaDescription();

  return generateRelationalMigrationSteps(currentSchema.schema, schemaInfo.getRelationalSchema());
}
