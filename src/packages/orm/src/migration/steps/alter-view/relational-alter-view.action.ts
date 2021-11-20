import { RelationalAlterViewMigrationStep } from './relational-alter-view.migration-step';
import { Client } from '@daita/relational/client/client';
import { table } from '@daita/relational';
import { CreateViewSql } from '@daita/relational/sql/ddl/create-view/create-view-sql';

export async function alterViewAction(client: Client<CreateViewSql<any>>, step: RelationalAlterViewMigrationStep) {
  await client.exec({
    createView: table(step.view, step.schema),
    orReplace: true,
    as: step.query,
  });
}
