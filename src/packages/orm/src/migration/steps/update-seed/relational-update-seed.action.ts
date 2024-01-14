import { RelationalUpdateSeedMigrationStep } from './relational-update-seed.migration-step';
import { table } from '@daita/relational';
import { UpdateSql } from '@daita/relational';
import { getWhereFromKeys } from '../get-where-from-keys';

export function updateSeedAction(step: RelationalUpdateSeedMigrationStep): UpdateSql<any> {
  const tbl = table(step.table, step.schema);
  return {
    update: tbl,
    set: step.seed,
    where: getWhereFromKeys(tbl, step.keys),
  };
}
