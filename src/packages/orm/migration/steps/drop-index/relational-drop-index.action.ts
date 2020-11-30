import { RelationalDropIndexMigrationStep } from './relational-drop-index.migration-step';
import { Client } from '../../../../relational/client/client';
import { table } from '../../../../relational';
import { DropIndexSql } from '../../../../relational/sql/ddl/drop-index/drop-index-sql';

export async function dropIndexAction(client: Client<DropIndexSql>, step: RelationalDropIndexMigrationStep) {
  await client.exec({
    dropIndex: step.name,
    on: table(step.table, step.schema),
  });
}
