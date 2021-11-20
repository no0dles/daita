import { CreateViewSql } from '@daita/relational/sql/ddl/create-view/create-view-sql';
import { RelationalAddViewMigrationStep } from './relational-add-view.migration-step';
import { Client } from '@daita/relational/client/client';
import { table } from '@daita/relational';

export async function addViewAction(client: Client<CreateViewSql<any>>, step: RelationalAddViewMigrationStep) {
  await client.exec({
    createView: table(step.view, step.schema),
    as: step.query,
  });
}
