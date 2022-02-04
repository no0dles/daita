import { RelationalDropIndexMigrationStep } from './relational-drop-index.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { DropIndexSql } from '@daita/relational';

export function dropIndexAction(
  client: RelationalTransactionAdapter<DropIndexSql>,
  step: RelationalDropIndexMigrationStep,
) {
  client.exec({
    dropIndex: step.name,
    on: table(step.table, step.schema),
  });
}
