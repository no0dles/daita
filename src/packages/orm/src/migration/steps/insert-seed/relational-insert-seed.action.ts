import { RelationalInsertSeedMigrationStep } from './relational-insert-seed.migration-step';
import { table } from '@daita/relational';
import { InsertSql } from '@daita/relational';
import { RelationalTransactionAdapter } from '@daita/relational';

export async function insertSeedAction(
  client: RelationalTransactionAdapter<InsertSql<any>>,
  step: RelationalInsertSeedMigrationStep,
) {
  await client.exec({
    insert: { ...step.keys, ...step.seed },
    into: table(step.table, step.schema),
  });
}
