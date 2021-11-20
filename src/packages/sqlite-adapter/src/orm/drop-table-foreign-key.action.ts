import { RelationalDropTableForeignKeyMigrationStep } from '@daita/orm/migration/steps/drop-table-foreign-key/relational-drop-table-foreign-key.migration-step';
import { Client } from '@daita/relational/client/client';
import { InsertSql } from '@daita/relational/sql/dml/insert/insert-sql';
import { CreateTableSql } from '@daita/relational/sql/ddl/create-table/create-table-sql';
import { DropTableSql } from '@daita/relational/sql/ddl/drop-table/drop-table-sql';
import { migrateTableAction } from './migrate-table.action';
import { SchemaDescription } from '@daita/orm/schema/description/relational-schema-description';

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
