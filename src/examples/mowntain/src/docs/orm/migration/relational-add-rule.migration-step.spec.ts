import { allow, authorized } from '@daita/relational';
import { now } from '@daita/relational';
import { authorizable, createMigrationTree, migrate } from '@daita/orm';
import { cleanupTestContext, getContexts } from '../../../testing';

describe('packages/orm/migration/steps/relational-add-rule', () => {
  const migrationTree = createMigrationTree([
    { kind: 'add_rule', rule: allow(authorized(), { select: now() }), ruleId: 'a' },
  ]);
  const ctx = getContexts();

  beforeAll(async () => {
    await migrate(ctx, migrationTree);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
