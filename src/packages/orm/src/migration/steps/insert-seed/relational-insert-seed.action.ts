import { RelationalInsertSeedMigrationStep } from './relational-insert-seed.migration-step';
import { table } from '@daita/relational';
import { InsertSql } from '@daita/relational';

export function insertSeedAction(step: RelationalInsertSeedMigrationStep): InsertSql<any> {
  return {
    insert: { ...step.keys, ...step.seed },
    into: table(step.table, step.schema),
  };
}
