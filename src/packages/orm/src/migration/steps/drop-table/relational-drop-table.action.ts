import { DropTableSql } from '@daita/relational';
import { RelationalDropTableMigrationStep } from './relational-drop-table.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';

export async function dropTableAction(
  client: RelationalTransactionAdapter<DropTableSql>,
  step: RelationalDropTableMigrationStep,
) {
  await client.exec({
    dropTable: table(step.table, step.schema),
  });
}
