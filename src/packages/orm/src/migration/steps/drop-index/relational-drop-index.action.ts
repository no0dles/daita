import { RelationalDropIndexMigrationStep } from './relational-drop-index.migration-step';
import { Client } from '@daita/relational/client/client';
import { table } from '@daita/relational';
import { DropIndexSql } from '@daita/relational/sql/ddl/drop-index/drop-index-sql';

export async function dropIndexAction(client: Client<DropIndexSql>, step: RelationalDropIndexMigrationStep) {
  await client.exec({
    dropIndex: step.name,
    on: table(step.table, step.schema),
  });
}
