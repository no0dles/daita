import { SchemaDescription } from '../../schema';
import { OrmSql } from '../sql';
import { Migration } from '../migration-tree';
import { generateSql } from './generate-sql';

export function generateMigration(
  currentSchema: SchemaDescription,
  newSchema: SchemaDescription,
  options: {
    id: string;
    after?: string;
    resolve?: string;
  },
): Migration<OrmSql> {
  return {
    id: options.id,
    resolve: options.resolve,
    after: options.after,
    upMigration: generateSql(currentSchema, newSchema),
    downMigration: generateSql(newSchema, currentSchema),
  };
}
