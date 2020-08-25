import { getMigrationContext } from '@daita/orm';
import { all, getClient, parseRule, RelationalTransactionAdapter, table } from '@daita/relational';
import { schema, userRule, userRuleId } from './add-rule.test';
import { adapterFactory } from '@daita/pg-adapter';

describe('apply/add-rule', () => {
  let dataAdapter: RelationalTransactionAdapter;

  beforeAll(async () => {
    dataAdapter = await adapterFactory.createTransactionAdapter({
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/test-cli',
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
      from: table('rules', 'daita')
    });
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe(userRuleId);
    expect(parseRule(rules[0].rule)).toBe(userRule);
  });
});
