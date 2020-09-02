import { schema, userRule, userRuleId } from './add-rule.test';
import { all, table } from '../../../../relational/sql/function';
import { getMigrationContext } from '../../../../orm/context';
import { parseRule } from '../../../../relational/permission';
import { getClient, TransactionClient } from '../../../../relational/client';
import { postgresAdapter } from '../../../../pg-adapter/adapter-implementation';

describe('apply/add-rule', () => {
  let client: TransactionClient<any>;

  beforeAll(async () => {
    client = getClient(postgresAdapter, {
      connectionString:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@localhost/test-cli',
      createIfNotExists: true,
      dropIfExists: true,
    });
    const context = getMigrationContext(client, schema);
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
