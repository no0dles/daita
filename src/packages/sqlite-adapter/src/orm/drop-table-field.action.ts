import { RelationalDropTableFieldMigrationStep } from '@daita/orm';
import { RelationalTransactionAdapter } from '@daita/relational';
import { DropTableSql } from '@daita/relational';
import { CreateTableSql } from '@daita/relational';
import { InsertSql } from '@daita/relational';
import { SchemaDescription } from '@daita/orm';
import { migrateTableAction } from './migrate-table.action';

export function dropTableFieldAction(
  client: RelationalTransactionAdapter<DropTableSql | CreateTableSql | InsertSql<any>>,
  step: RelationalDropTableFieldMigrationStep,
  targetSchema: SchemaDescription,
) {
  migrateTableAction(
    client,
    step.table,
    step.schema,
    (f) => f.name !== step.fieldName,
    (r) => true,
    targetSchema,
  );
}
