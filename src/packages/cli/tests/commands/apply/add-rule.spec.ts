import { schema, userRule, userRuleId } from './add-rule.test';
import { adapter, PostgresAdapterOptions } from '../../../../pg-adapter/adapter';
import { getMigrationContext } from '../../../../orm/context/get-migration-context';
import { parseRule } from '../../../../relational/permission/parsing';
import { getClient } from '../../../../relational/client/get-client';
import { all } from '../../../../relational/sql/function/all';
import { table } from '../../../../relational/sql/function/table';
import { MigrationClient } from '../../../../relational/client/migration-client';

describe('apply/add-rule', () => {
  let client: MigrationClient<any>;

  beforeAll(async () => {
    const options: PostgresAdapterOptions = {
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/test-cli',
      createIfNotExists: true,
      dropIfExists: true,
    };
    client = getClient(adapter, options);
    const context = getMigrationContext(schema, client);
    await context.update();
  });

  afterAll(async () => {
    await client.close();
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
