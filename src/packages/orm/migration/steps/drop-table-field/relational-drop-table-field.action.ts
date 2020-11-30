import { table } from '../../../../relational';
import { RelationalDropTableFieldMigrationStep } from './relational-drop-table-field.migration-step';
import { Client } from '../../../../relational/client/client';
import { AlterTableDropColumnSql } from '../../../../relational/sql/ddl/alter-table/alter-table-sql';

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
