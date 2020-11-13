import { schema, userRule, userRuleId } from './add-rule.test';
import { adapter } from '../../../pg-adapter/adapter/adapter';
import { parseRule } from '../../../relational/permission/parsing';
import { all } from '../../../relational/sql/keyword/all/all';
import { table } from '../../../relational/sql/keyword/table/table';
import { getPostgresDb, PostgresDb } from '../../../../testing/postgres-test';
import { getContext } from '../../../orm';
import { MigrationContext } from '../../../orm/context/get-migration-context';

describe('cli/commands/apply/add-rule', () => {
  let ctx: MigrationContext<any>;
  let db: PostgresDb;

  beforeAll(async () => {
    db = await getPostgresDb();
    ctx = getContext(adapter, {
      schema,
      connectionString: db.connectionString,
      createIfNotExists: true,
      dropIfExists: true,
    });
    await ctx.migrate();
  });

  afterAll(async () => {
    await ctx.close();
    await db.close();
  });

  it('should add rules table', async () => {
    const rules = await ctx.select({
      select: all<any>(),
      from: table('rules', 'daita'),
    });
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe(userRuleId);
    expect(parseRule(rules[0].rule)).toEqual(userRule);
  });
});
