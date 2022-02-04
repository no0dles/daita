import { RelationalDropTablePrimaryKeyMigrationStep } from './relational-drop-table-primary-key.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { AlterTableDropConstraintSql } from '@daita/relational';

export function dropTablePrimaryKeyAction(
  client: RelationalTransactionAdapter<AlterTableDropConstraintSql>,
  step: RelationalDropTablePrimaryKeyMigrationStep,
) {
  client.exec({
    alterTable: table(step.table, step.schema),
    drop: {
      constraint: `${step.table}_pkey`,
    },
  });
}
