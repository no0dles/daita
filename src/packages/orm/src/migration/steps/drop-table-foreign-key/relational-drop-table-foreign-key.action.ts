import { RelationalDropTableForeignKeyMigrationStep } from './relational-drop-table-foreign-key.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { AlterTableDropConstraintSql } from '@daita/relational';

export async function dropTableForeignKeyAction(
  client: RelationalTransactionAdapter<AlterTableDropConstraintSql>,
  step: RelationalDropTableForeignKeyMigrationStep,
) {
  await client.exec({
    alterTable: table(step.table, step.schema),
    drop: {
      constraint: step.name,
    },
  });
}
