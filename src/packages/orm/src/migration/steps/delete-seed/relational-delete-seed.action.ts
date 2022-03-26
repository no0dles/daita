import { DeleteSql } from '@daita/relational';
import { RelationalDeleteSeedMigrationStep } from './relational-delete-seed.migration-step';
import { table } from '@daita/relational';
import { getWhereFromKeys } from '../get-where-from-keys';

export function deleteSeedAction(step: RelationalDeleteSeedMigrationStep): DeleteSql {
  const tbl = table(step.table, step.schema);
  return {
    delete: tbl,
    where: getWhereFromKeys(tbl, step.keys),
  };
}
