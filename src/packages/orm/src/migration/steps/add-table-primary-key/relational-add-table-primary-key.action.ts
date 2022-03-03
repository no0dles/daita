import { RelationalAddTablePrimaryKey } from './relational-add-table-primary-key.migration-step';
import { hasAddTableStep, MigrationDescription } from '../../migration-description';
import { AlterTableAddPrimaryKeySql, RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';

export function addTablePrimaryKeyAction(
  client: RelationalTransactionAdapter<AlterTableAddPrimaryKeySql>,
  step: RelationalAddTablePrimaryKey,
  migration: MigrationDescription,
) {
  const tbl = table(step.table, step.schema);
  if (hasAddTableStep(migration, tbl)) {
    return;
  }

  client.exec({
    alterTable: tbl,
    add: {
      primaryKey: step.fieldNames,
    },
  });
}
