import { RelationalDropTableFieldMigrationStep } from '@daita/orm/migration/steps/drop-table-field/relational-drop-table-field.migration-step';
import { Client } from '@daita/relational/client/client';
import { DropTableSql } from '@daita/relational/sql/ddl/drop-table/drop-table-sql';
import { CreateTableSql } from '@daita/relational/sql/ddl/create-table/create-table-sql';
import { InsertSql } from '@daita/relational/sql/dml/insert/insert-sql';
import { SchemaDescription } from '@daita/orm/schema/description/relational-schema-description';
import { migrateTableAction } from './migrate-table.action';

export async function dropTableFieldAction(
  client: Client<DropTableSql | CreateTableSql | InsertSql<any>>,
  step: RelationalDropTableFieldMigrationStep,
  targetSchema: SchemaDescription,
) {
  await migrateTableAction(
    client,
    step.table,
    step.schema,
    (f) => f.name !== step.fieldName,
    (r) => true,
    targetSchema,
  );
}
