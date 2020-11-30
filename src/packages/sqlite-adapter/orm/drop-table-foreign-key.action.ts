import { RelationalDropTableForeignKeyMigrationStep } from '../../orm/migration/steps/drop-table-foreign-key/relational-drop-table-foreign-key.migration-step';
import { Client } from '../../relational/client/client';
import { InsertSql } from '../../relational/sql/dml/insert/insert-sql';
import { CreateTableSql } from '../../relational/sql/ddl/create-table/create-table-sql';
import { DropTableSql } from '../../relational/sql/ddl/drop-table/drop-table-sql';
import { migrateTableAction } from './migrate-table.action';
import { SchemaDescription } from '../../orm/schema/description/relational-schema-description';

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
