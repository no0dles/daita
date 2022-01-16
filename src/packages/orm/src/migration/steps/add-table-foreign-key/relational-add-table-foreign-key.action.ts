import { RelationalAddTableForeignKeyMigrationStep } from './relational-add-table-foreign-key.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { AlterTableAddForeignKeySql } from '@daita/relational';

export async function addTableForeignKeyAction(
  client: RelationalTransactionAdapter<AlterTableAddForeignKeySql<any>>,
  step: RelationalAddTableForeignKeyMigrationStep,
) {
  await client.exec({
    alterTable: table(step.table, step.schema),
    add: {
      constraint: step.name,
      foreignKey: step.fieldNames,
      references: {
        table: table(step.foreignTable, step.foreignTableSchema),
        primaryKeys: step.foreignFieldNames,
      },
    },
  });
}
