import { CreateViewSql } from '@daita/relational';
import { RelationalAddViewMigrationStep } from './relational-add-view.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';

export function addViewAction(
  client: RelationalTransactionAdapter<CreateViewSql<any>>,
  step: RelationalAddViewMigrationStep,
) {
  client.exec({
    createView: table(step.view, step.schema),
    as: step.query,
  });
}
