import { DropViewSql } from '@daita/relational';
import { RelationalDropViewMigrationStep } from './relational-drop-view.migration-step';
import { Client } from '@daita/relational';
import { table } from '@daita/relational';

export async function dropViewAction(client: Client<DropViewSql>, step: RelationalDropViewMigrationStep) {
  await client.exec({
    dropView: table(step.view, step.schema),
  });
}
