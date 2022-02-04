import { seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';
import { RelationalAdapter } from '@daita/relational';

describe('relational/sql/ddl/create-schema', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should create schema', async () => {
    await ctx.exec({
      createSchema: 'auth',
    });
  });

  it('should create schema if not exists', async () => {
    await ctx.exec({
      createSchema: 'auth',
      ifNotExists: true,
    });
  });
});
