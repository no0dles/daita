import { RelationalCreateIndexMigrationStep } from './relational-create-index.migration-step';
import { Client } from '../../../../relational/client/client';
import { table } from '../../../../relational';
import { CreateIndexSql } from '../../../../relational/sql/ddl/create-index/create-index-sql';

export async function createIndexAction(client: Client<CreateIndexSql<any>>, step: RelationalCreateIndexMigrationStep) {
  await client.exec({
    createIndex: step.name,
    on: table(step.table, step.schema),
    columns: step.fields,
    unique: step.unique ?? false,
  });
}
