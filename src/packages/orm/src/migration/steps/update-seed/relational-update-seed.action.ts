import { RelationalUpdateSeedMigrationStep } from './relational-update-seed.migration-step';
import { RelationalTransactionAdapter, table } from '@daita/relational';
import { UpdateSql } from '@daita/relational';
import { getWhereFromKeys } from '../get-where-from-keys';

export function updateSeedAction(
  client: RelationalTransactionAdapter<UpdateSql<any>>,
  step: RelationalUpdateSeedMigrationStep,
) {
  const tbl = table(step.table, step.schema);
  client.exec({
    update: tbl,
    set: step.seed,
    where: getWhereFromKeys(tbl, step.keys),
  });
}
