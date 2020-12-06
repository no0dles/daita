import { DropTableSql } from '../../../../relational/sql/ddl/drop-table/drop-table-sql';
import { RelationalDropTableMigrationStep } from './relational-drop-table.migration-step';
import { Client } from '../../../../relational/client/client';
import { table } from '../../../../relational';

export async function dropTableAction(client: Client<DropTableSql>, step: RelationalDropTableMigrationStep) {
  await client.exec({
    dropTable: table(step.table, step.schema),
  });
}
