import { table } from '@daita/relational';
import { RelationalDropTableFieldMigrationStep } from './relational-drop-table-field.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { AlterTableDropColumnSql } from '@daita/relational';

export function dropTableField(
  client: RelationalTransactionAdapter<AlterTableDropColumnSql>,
  step: RelationalDropTableFieldMigrationStep,
) {
  client.exec({
    alterTable: table(step.table, step.schema),
    drop: {
      column: step.fieldName,
    },
  });
}
