import { schema, userRule, userRuleId } from './add-rule.test';
import { all, table } from '../../../../relational/sql/function';
import { getMigrationContext } from '../../../../orm/context';
import { parseRule } from '../../../../relational/permission';
import { RelationalTransactionAdapter } from '../../../../relational/adapter';
import { getClient } from '../../../../relational/client';
import { adapterFactory } from '../../../../pg-adapter';

describe('apply/add-rule', () => {
  let dataAdapter: RelationalTransactionAdapter;

  beforeAll(async () => {
    dataAdapter = await adapterFactory.createTransactionAdapter({
      connectionString:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@localhost/test-cli',
      createIfNotExists: true,
      dropIfExists: true,
      database: 'test-cli',
    });
    const client = getClient(dataAdapter);
    const context = getMigrationContext(client, schema);
    await context.update();
  });

  afterAll(async () => {
    await dataAdapter.close();
  });

  it('should add rules table', async () => {
    const client = getClient(dataAdapter);
    const rules = await client.select({
      select: all<any>(),
      from: table('rules', 'daita'),
    });
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe(userRuleId);
    expect(parseRule(rules[0].rule)).toEqual(userRule);
  });
});
