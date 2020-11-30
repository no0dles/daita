import { RelationalAddTablePrimaryKey } from './relational-add-table-primary-key.migration-step';
import { hasAddTableStep, MigrationDescription } from '../../migration-description';
import { Client } from '../../../../relational/client/client';
import { table } from '../../../../relational';

export async function addTablePrimaryKeyAction(
  client: Client<any>,
  step: RelationalAddTablePrimaryKey,
  migration: MigrationDescription,
) {
  const tbl = table(step.table, step.schema);
  if (hasAddTableStep(migration, tbl)) {
    return;
  }

  throw new Error('adding primary keys afterwards is not supported yet');
}
