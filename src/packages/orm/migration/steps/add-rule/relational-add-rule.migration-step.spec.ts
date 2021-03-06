import { testContext } from '../../../../../testing/relational/adapters';
import { createMigrationTree } from '../../create-migration-tree';
import { allow, authorized } from '../../../../relational';
import { now } from '../../../../relational/sql/function/date/now/now';
import { getRuleId } from '../../../../relational/permission/rule-id';

describe('packages/orm/migration/steps/relational-add-rule', () => {
  const testRule = allow(authorized(), { select: now() });
  const schema = createMigrationTree([{ kind: 'add_rule', rule: testRule, ruleId: getRuleId(testRule) }]);
  const ctxs = [
    ...testContext(schema, ['pg', 'sqlite', 'mariadb']),
    testContext(schema, 'http-sqlite', { user: { roles: ['daita:migration:admin'] } }),
  ];

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.migrate();
    });

    it('should allow authorized access', async () => {
      const authorizedContext = ctx.authorize({
        isAuthorized: true,
        userId: 'foo',
        roles: [],
      });
      const res = await authorizedContext.selectFirst({ select: now() });
      expect(res).toBeInstanceOf(Date);
    });

    it('should not allow unauthorized access', async () => {
      const unauthorizedContext = ctx.authorize({
        isAuthorized: false,
        userId: undefined,
        roles: undefined,
      });
      try {
        await unauthorizedContext.selectFirst({ select: now() });
      } catch (e) {
        console.log(e);
      }
    });
  });
});
