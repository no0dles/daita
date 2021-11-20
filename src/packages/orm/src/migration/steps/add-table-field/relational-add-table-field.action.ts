import { Client } from '@daita/relational';
import { RelationalAddTableFieldMigrationStep } from './relational-add-table-field.migration-step';
import { hasAddTableStep, MigrationDescription } from '../../migration-description';
import { table } from '@daita/relational';
import { AlterTableAddColumnSql } from '@daita/relational';

export async function addTableFieldAction(
  client: Client<AlterTableAddColumnSql>,
  step: RelationalAddTableFieldMigrationStep,
  migration: MigrationDescription,
) {
  const tbl = table(step.table, step.schema);
  if (hasAddTableStep(migration, tbl)) {
    return;
  }

  await client.exec({
    alterTable: tbl,
    add: {
      column: step.fieldName,
      type: step.type,
      size: step.size,
    },
  });
}
