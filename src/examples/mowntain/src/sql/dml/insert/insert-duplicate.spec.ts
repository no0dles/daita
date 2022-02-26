import { DuplicateKeyError, RelationalAdapter, table } from '@daita/relational';
import { seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';
import { Canton } from '../../../models/canton';

describe('insert duplicate', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should insert duplicate and report error', async () => {
    try {
      await ctx.insert({
        into: table(Canton),
        insert: {
          name: 'Bern',
          shortname: 'BE',
        },
      });
      throw new Error('should not be reached');
    } catch (e) {
      expect(e).toBeInstanceOf(DuplicateKeyError);
    }
  });
});
