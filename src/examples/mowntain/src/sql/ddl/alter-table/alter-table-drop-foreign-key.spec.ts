import { RelationalAdapter, table } from '@daita/relational';
import { Ascent } from '../../../models/ascent';
import { AscentPerson } from '../../../models/ascent-person';
import { seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/ddl/alter-table', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should drop foreign key with constraint name', async () => {
    await ctx.exec({
      alterTable: table(AscentPerson),
      add: {
        foreignKey: 'ascentId',
        constraint: 'ascent2',
        references: {
          table: table(Ascent),
          primaryKeys: 'id',
        },
      },
    });
    await ctx.exec({
      alterTable: table(AscentPerson),
      drop: {
        constraint: 'ascent2',
      },
    });
  });
});
