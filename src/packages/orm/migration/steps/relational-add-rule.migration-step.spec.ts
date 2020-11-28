import { testContext } from '../../../../testing/relational/adapters';
import { createMigrationTree } from '../create-migration-tree';
import { allow, authorized } from '../../../relational';
import { now } from '../../../relational/sql/function/date/now/now';
import { getRuleId } from '../../../relational/permission/rule-id';

describe('packages/orm/migration/steps/relational-add-rule', () => {
  const testRule = allow(authorized(), { select: now() });
  const schema = createMigrationTree([{ kind: 'add_rule', rule: testRule, ruleId: getRuleId(testRule) }]);
  const ctxs = testContext(schema, 'pg', 'sqlite');

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.migrate();
    });

    it('should add', () => {});
  });
});
