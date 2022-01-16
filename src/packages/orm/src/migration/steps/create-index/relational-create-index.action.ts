import { RelationalCreateIndexMigrationStep } from './relational-create-index.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { CreateIndexSql } from '@daita/relational';

export async function createIndexAction(
  client: RelationalTransactionAdapter<CreateIndexSql<any>>,
  step: RelationalCreateIndexMigrationStep,
) {
  await client.exec({
    createIndex: step.name,
    on: table(step.table, step.schema),
    columns: step.fields,
    unique: step.unique ?? false,
  });
}
