import { RelationalDropTablePrimaryKeyMigrationStep } from './relational-drop-table-primary-key.migration-step';
import { Client } from '../../../../relational/client/client';
import { table } from '../../../../relational';
import { AlterTableDropConstraintSql } from '../../../../relational/sql/ddl/alter-table/alter-table-sql';

export async function dropTablePrimaryKeyAction(
  client: Client<AlterTableDropConstraintSql>,
  step: RelationalDropTablePrimaryKeyMigrationStep,
) {
  await client.exec({
    alterTable: table(step.table, step.schema),
    drop: {
      constraint: `${step.table}_pkey`,
    },
  });
}
