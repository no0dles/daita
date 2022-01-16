import { RelationalAlterViewMigrationStep } from './relational-alter-view.migration-step';
import { RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { CreateViewSql } from '@daita/relational';

export async function alterViewAction(
  client: RelationalTransactionAdapter<CreateViewSql<any>>,
  step: RelationalAlterViewMigrationStep,
) {
  await client.exec({
    createView: table(step.view, step.schema),
    orReplace: true,
    as: step.query,
  });
}
