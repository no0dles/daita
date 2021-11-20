import { RelationalDropTableFieldMigrationStep } from '@daita/orm';
import { Client } from '@daita/relational';
import { DropTableSql } from '@daita/relational';
import { CreateTableSql } from '@daita/relational';
import { InsertSql } from '@daita/relational';
import { SchemaDescription } from '@daita/orm';
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
