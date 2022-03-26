import { RelationalCreateIndexMigrationStep } from './relational-create-index.migration-step';
import { table } from '@daita/relational';
import { CreateIndexSql } from '@daita/relational';

export function createIndexAction(step: RelationalCreateIndexMigrationStep): CreateIndexSql<any> {
  return {
    createIndex: step.name,
    on: table(step.table, step.schema),
    columns: step.fields,
    unique: step.unique ?? false,
  };
}
