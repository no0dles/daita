import { DropTableSql } from '@daita/relational';
import { RelationalDropTableMigrationStep } from './relational-drop-table.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';

export function dropTableAction(
  client: RelationalTransactionAdapter<DropTableSql>,
  step: RelationalDropTableMigrationStep,
) {
  client.exec({
    dropTable: table(step.table, step.schema),
  });
}
