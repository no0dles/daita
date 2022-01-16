import { CreateViewSql } from '@daita/relational';
import { RelationalAddViewMigrationStep } from './relational-add-view.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';

export async function addViewAction(
  client: RelationalTransactionAdapter<CreateViewSql<any>>,
  step: RelationalAddViewMigrationStep,
) {
  await client.exec({
    createView: table(step.view, step.schema),
    as: step.query,
  });
}
