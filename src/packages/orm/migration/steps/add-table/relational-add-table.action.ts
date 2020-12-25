import { RelationalAddTableMigrationStep } from './relational-add-table.migration-step';
import { CreateTableSql } from '../../../../relational/sql/ddl/create-table/create-table-sql';
import { Client } from '../../../../relational/client/client';
import { table } from '../../../../relational';
import { CreateSchemaSql } from '../../../../relational/sql/ddl/create-schema/create-schema-sql';
import { isAddTableFieldStep } from '../add-table-field/relational-add-table-field.migration-step';
import { MigrationDescription } from '../../migration-description';

export async function addTableAction(
  client: Client<CreateTableSql>,
  step: RelationalAddTableMigrationStep,
  migration: MigrationDescription,
) {
  const tbl = table(step.table, step.schema);
  await client.exec({
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

export async function addTableWithSchemaAction(
  client: Client<CreateTableSql | CreateSchemaSql>,
  step: RelationalAddTableMigrationStep,
  migration: MigrationDescription,
) {
  if (step.schema) {
    await client.exec({
      createSchema: step.schema,
      ifNotExists: true,
    });
  }
  await addTableAction(client, step, migration);
}
