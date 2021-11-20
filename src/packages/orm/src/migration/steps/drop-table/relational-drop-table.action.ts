import { DropTableSql } from '@daita/relational/sql/ddl/drop-table/drop-table-sql';
import { RelationalDropTableMigrationStep } from './relational-drop-table.migration-step';
import { Client } from '@daita/relational/client/client';
import { table } from '@daita/relational';

export async function dropTableAction(client: Client<DropTableSql>, step: RelationalDropTableMigrationStep) {
  await client.exec({
    dropTable: table(step.table, step.schema),
  });
}
