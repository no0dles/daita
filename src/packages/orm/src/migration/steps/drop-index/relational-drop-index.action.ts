import { RelationalDropIndexMigrationStep } from './relational-drop-index.migration-step';
import { Client } from '@daita/relational';
import { table } from '@daita/relational';
import { DropIndexSql } from '@daita/relational';

export async function dropIndexAction(client: Client<DropIndexSql>, step: RelationalDropIndexMigrationStep) {
  await client.exec({
    dropIndex: step.name,
    on: table(step.table, step.schema),
  });
}
