import { RelationalAdapter } from '@daita/relational';
import { now } from '@daita/relational';
import { authorizable, migrate, MigrationTree, RelationalOrmAdapter } from '@daita/orm';
import { getTestAdapter } from '../../../testing';

describe('packages/orm/migration/steps/relational-add-rule', () => {
  const migrationTree = new MigrationTree('test', [
    {
      id: 'test',
      upMigration: [
        // {
        //   insert: {},
        //   into: table(MigrationRules),
        // },
        // TODO
      ],
      downMigration: [],
    },
  ]);

  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await getTestAdapter('pg');
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
