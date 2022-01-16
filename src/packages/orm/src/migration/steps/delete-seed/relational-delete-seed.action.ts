import { DeleteSql } from '@daita/relational';
import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalDeleteSeedMigrationStep } from './relational-delete-seed.migration-step';
import { table } from '@daita/relational';
import { getWhereFromKeys } from '../get-where-from-keys';

export async function deleteSeedAction(
  client: RelationalTransactionAdapter<DeleteSql>,
  step: RelationalDeleteSeedMigrationStep,
) {
  const tbl = table(step.table, step.schema);
  await client.exec({
    delete: tbl,
    where: getWhereFromKeys(tbl, step.keys),
  });
}
