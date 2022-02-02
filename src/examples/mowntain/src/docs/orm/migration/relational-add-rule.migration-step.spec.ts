import { allow, authorized, RelationalAdapter } from '@daita/relational';
import { now } from '@daita/relational';
import { authorizable, createMigrationTree, migrate, RelationalOrmAdapter } from '@daita/orm';
import { cleanupTestContext, getContexts, getTestAdapter } from '../../../testing';

describe('packages/orm/migration/steps/relational-add-rule', () => {
  const migrationTree = createMigrationTree([
    { kind: 'add_rule', rule: allow(authorized(), { select: now() }), ruleId: 'a' },
  ]);

  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await getTestAdapter();
    await migrate(ctx, migrationTree);
  });

  afterAll(async () => ctx.close());

  it('should allow authorized access', async () => {
    const authorizedContext = authorizable(ctx, { migrationTree }).authorize({
      isAuthorized: true,
      userId: 'foo',
      roles: [],
    });
    const res = await authorizedContext.isAuthorized({ select: now() });
    expect(res).toEqual(true);
  });

  it('should not allow unauthorized access', async () => {
    const unauthorizedContext = authorizable(ctx, { migrationTree }).authorize({
      isAuthorized: false,
      userId: undefined,
      roles: undefined,
    });
    const res = await unauthorizedContext.isAuthorized({ select: now() });
    expect(res).toEqual(false);
  });
});
