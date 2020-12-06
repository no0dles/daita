import { DeleteSql } from '../../../../relational/sql/dml/delete/delete-sql';
import { Client } from '../../../../relational/client/client';
import { RelationalDeleteSeedMigrationStep } from './relational-delete-seed.migration-step';
import { table } from '../../../../relational';
import { getWhereFromKeys } from '../get-where-from-keys';

export async function deleteSeedAction(client: Client<DeleteSql>, step: RelationalDeleteSeedMigrationStep) {
  const tbl = table(step.table, step.schema);
  await client.exec({
    delete: tbl,
    where: getWhereFromKeys(tbl, step.keys),
  });
}
