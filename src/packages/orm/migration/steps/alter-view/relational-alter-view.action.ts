import { RelationalAlterViewMigrationStep } from './relational-alter-view.migration-step';
import { Client } from '../../../../relational/client/client';
import { table } from '../../../../relational';
import { CreateViewSql } from '../../../../relational/sql/ddl/create-view/create-view-sql';

export async function alterViewAction(client: Client<CreateViewSql<any>>, step: RelationalAlterViewMigrationStep) {
  await client.exec({
    createView: table(step.view, step.schema),
    orReplace: true,
    as: step.query,
  });
}
