import { RelationalDropTableForeignKeyMigrationStep } from '@daita/orm';
import { Client } from '@daita/relational';
import { InsertSql } from '@daita/relational';
import { CreateTableSql } from '@daita/relational';
import { DropTableSql } from '@daita/relational';
import { migrateTableAction } from './migrate-table.action';
import { SchemaDescription } from '@daita/orm';

export async function dropTableForeignKeyAction(
  client: Client<InsertSql<any> | CreateTableSql | DropTableSql>,
  step: RelationalDropTableForeignKeyMigrationStep,
  targetSchema: SchemaDescription,
) {
  await migrateTableAction(
    client,
    step.table,
    step.schema,
    (f) => true,
    (r) => r.name !== step.name,
    targetSchema,
  );
}
