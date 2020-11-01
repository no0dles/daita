import { schema, userRule, userRuleId } from './add-rule.test';
import { adapter } from '../../../../pg-adapter/adapter-implementation';
import { getMigrationContext } from '../../../../orm/context/get-migration-context';
import { parseRule } from '../../../../relational/permission/parsing';
import { TransactionClient } from '../../../../relational/client/transaction-client';
import { getClient } from '../../../../relational/client/get-client';
import { all } from '../../../../relational/sql/function/all';
import { table } from '../../../../relational/sql/function/table';

describe('apply/add-rule', () => {
  let client: TransactionClient<any>;

  beforeAll(async () => {
    client = getClient(adapter, {
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/test-cli',
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
