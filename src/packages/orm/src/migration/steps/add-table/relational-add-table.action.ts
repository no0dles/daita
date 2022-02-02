import { RelationalAddTableMigrationStep } from './relational-add-table.migration-step';
import { CreateTableSql } from '@daita/relational';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { CreateSchemaSql } from '@daita/relational';
import { isAddTableFieldStep } from '../add-table-field/relational-add-table-field.migration-step';
import { MigrationDescription } from '../../migration-description';

export function addTableAction(
  client: RelationalTransactionAdapter<CreateTableSql>,
  step: RelationalAddTableMigrationStep,
  migration: MigrationDescription,
) {
  const tbl = table(step.table, step.schema);
  client.exec({
    createTable: tbl,
    columns: migration.steps
      .filter(isAddTableFieldStep)
      .filter((s) => s.table === step.table && s.schema === step.schema)
      .map((columnStep) => ({
        name: columnStep.fieldName,
        type: columnStep.type,
        size: columnStep.size,
        primaryKey: migration.steps.some(
          (s) =>
            s.kind === 'add_table_primary_key' &&
            s.schema === step.schema &&
            s.table === step.table &&
            s.fieldNames.indexOf(columnStep.fieldName) >= 0,
        ),
        notNull: false,
      })),
  });
}

export function addTableWithSchemaAction(
  client: RelationalTransactionAdapter<CreateTableSql | CreateSchemaSql>,
  step: RelationalAddTableMigrationStep,
  migration: MigrationDescription,
) {
  if (step.schema) {
    client.exec({
      createSchema: step.schema,
      ifNotExists: true,
    });
  }
  addTableAction(client, step, migration);
}
