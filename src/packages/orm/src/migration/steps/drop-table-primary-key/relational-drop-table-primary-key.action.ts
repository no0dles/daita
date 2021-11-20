import { RelationalDropTablePrimaryKeyMigrationStep } from './relational-drop-table-primary-key.migration-step';
import { Client } from '@daita/relational';
import { table } from '@daita/relational';
import { AlterTableDropConstraintSql } from '@daita/relational';

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
