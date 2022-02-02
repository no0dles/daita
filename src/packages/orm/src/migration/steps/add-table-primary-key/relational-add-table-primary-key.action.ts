import { RelationalAddTablePrimaryKey } from './relational-add-table-primary-key.migration-step';
import { hasAddTableStep, MigrationDescription } from '../../migration-description';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';

export function addTablePrimaryKeyAction(
  client: RelationalTransactionAdapter<any>,
  step: RelationalAddTablePrimaryKey,
  migration: MigrationDescription,
) {
  const tbl = table(step.table, step.schema);
  if (hasAddTableStep(migration, tbl)) {
    return;
  }

  throw new Error('adding primary keys afterwards is not supported yet');
}
