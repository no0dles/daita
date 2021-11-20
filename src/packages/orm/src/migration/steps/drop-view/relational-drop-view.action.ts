import { DropViewSql } from '@daita/relational/sql/ddl/drop-view/drop-view-sql';
import { RelationalDropViewMigrationStep } from './relational-drop-view.migration-step';
import { Client } from '@daita/relational/client/client';
import { table } from '@daita/relational';

export async function dropViewAction(client: Client<DropViewSql>, step: RelationalDropViewMigrationStep) {
  await client.exec({
    dropView: table(step.view, step.schema),
  });
}
