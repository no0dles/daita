import { RelationalDropTableForeignKeyMigrationStep } from './relational-drop-table-foreign-key.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { AlterTableDropConstraintSql } from '@daita/relational';

export function dropTableForeignKeyAction(
  client: RelationalTransactionAdapter<AlterTableDropConstraintSql>,
  step: RelationalDropTableForeignKeyMigrationStep,
) {
  client.exec({
    alterTable: table(step.table, step.schema),
    drop: {
      constraint: step.name,
    },
  });
}
