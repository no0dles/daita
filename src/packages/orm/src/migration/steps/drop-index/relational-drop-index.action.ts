import { RelationalDropIndexMigrationStep } from './relational-drop-index.migration-step';
import { table } from '@daita/relational';
import { DropIndexSql } from '@daita/relational';

export function dropIndexAction(step: RelationalDropIndexMigrationStep): DropIndexSql {
  return {
    dropIndex: step.name,
    on: table(step.table, step.schema),
  };
}
