import { table } from '@daita/relational';
import { Ascent } from '../../../models/ascent';
import { AscentPerson } from '../../../models/ascent-person';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';

describe('relational/sql/ddl/alter-table', () => {
  const ctx = getMowntainTestContext({
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

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
