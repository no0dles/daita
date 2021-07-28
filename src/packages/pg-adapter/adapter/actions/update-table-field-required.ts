import { Client } from '../../../relational/client/client';
import { table } from '../../../relational';
import { RelationalUpdateTableFieldRequiredMigrationStep } from '../../../orm/migration/steps/update-table-field-required/relational-update-table-field-required.migration-step';
import { PostgresAlterTableSql } from '../../sql/alter-table-sql';

export async function updateTableFieldRequiredAction(
  client: Client<PostgresAlterTableSql>,
  step: RelationalUpdateTableFieldRequiredMigrationStep,
) {
  if (step.required) {
    await client.exec({
      alterTable: table(step.table, step.schema),
      alterColumn: {
        set: 'not null',
      },
    });
  } else {
    await client.exec({
      alterTable: table(step.table, step.schema),
      alterColumn: {
        drop: 'not null',
      },
    });
  }
}
