import { RelationalAddTableForeignKeyMigrationStep } from './relational-add-table-foreign-key.migration-step';
import { Client } from '@daita/relational/client/client';
import { table } from '@daita/relational';
import { AlterTableAddForeignKeySql } from '@daita/relational/sql/ddl/alter-table/alter-table-sql';

export async function addTableForeignKeyAction(
  client: Client<AlterTableAddForeignKeySql<any>>,
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
