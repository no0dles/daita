import { DropViewSql } from '@daita/relational';
import { RelationalDropViewMigrationStep } from './relational-drop-view.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';

export function dropViewAction(
  client: RelationalTransactionAdapter<DropViewSql>,
  step: RelationalDropViewMigrationStep,
) {
  client.exec({
    dropView: table(step.view, step.schema),
  });
}
