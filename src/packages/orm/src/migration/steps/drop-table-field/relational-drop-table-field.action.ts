import { table } from '@daita/relational';
import { RelationalDropTableFieldMigrationStep } from './relational-drop-table-field.migration-step';
import { Client } from '@daita/relational';
import { AlterTableDropColumnSql } from '@daita/relational';

export async function dropTableField(
  client: Client<AlterTableDropColumnSql>,
  step: RelationalDropTableFieldMigrationStep,
) {
  await client.exec({
    alterTable: table(step.table, step.schema),
    drop: {
      column: step.fieldName,
    },
  });
}
