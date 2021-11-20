import { RelationalUpdateSeedMigrationStep } from './relational-update-seed.migration-step';
import { table } from '@daita/relational';
import { Client } from '@daita/relational/client/client';
import { UpdateSql } from '@daita/relational/sql/dml/update/update-sql';
import { getWhereFromKeys } from '../get-where-from-keys';

export async function updateSeedAction(client: Client<UpdateSql<any>>, step: RelationalUpdateSeedMigrationStep) {
  const tbl = table(step.table, step.schema);
  await client.exec({
    update: tbl,
    set: step.seed,
    where: getWhereFromKeys(tbl, step.keys),
  });
}
