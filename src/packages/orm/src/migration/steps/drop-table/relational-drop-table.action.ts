import { DropTableSql } from '@daita/relational';
import { RelationalDropTableMigrationStep } from './relational-drop-table.migration-step';
import { table } from '@daita/relational';

export function dropTableAction(step: RelationalDropTableMigrationStep): DropTableSql {
  return {
    dropTable: table(step.table, step.schema),
  };
}
