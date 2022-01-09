import { RelationalDropTableForeignKeyMigrationStep } from './relational-drop-table-foreign-key.migration-step';
import { Client } from '@daita/relational';
import { table } from '@daita/relational';
import { AlterTableDropConstraintSql } from '@daita/relational';

export async function dropTableForeignKeyAction(
  client: Client<AlterTableDropConstraintSql>,
  step: RelationalDropTableForeignKeyMigrationStep,
) {
  await client.exec({
    alterTable: table(step.table, step.schema),
    drop: {
      constraint: step.name,
    },
  });
}