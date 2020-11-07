import { schema, userRule, userRuleId } from './add-rule.test';
import { adapter } from '../../../pg-adapter/adapter/adapter';
import { getMigrationContext } from '../../../orm/context/get-migration-context';
import { parseRule } from '../../../relational/permission/parsing';
import { getClient } from '../../../relational/client/get-client';
import { all } from '../../../relational/sql/keyword/all/all';
import { table } from '../../../relational/sql/keyword/table/table';
import { MigrationClient } from '../../../relational/client/migration-client';
import { getPostgresDb, PostgresDb } from '../../../../testing/postgres-test';

describe('apply/add-rule', () => {
  let client: MigrationClient<any>;
  let db: PostgresDb;

  beforeAll(async () => {
    db = await getPostgresDb().start();
    client = getClient(adapter, {
      connectionString: db.connectionString,
      createIfNotExists: true,
      dropIfExists: true,
    });
    const context = getMigrationContext(schema, client);
    await context.update();
  });

  afterAll(async () => {
    await client.close();
    await db.close();
  });

  it('should add rules table', async () => {
    const rules = await client.select({
      select: all<any>(),
      from: table('rules', 'daita'),
    });
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe(userRuleId);
    expect(parseRule(rules[0].rule)).toEqual(userRule);
  });
});
