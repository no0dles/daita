import { table } from '@daita/relational';
import { Ascent } from '../../../models/ascent';
import { AscentPerson } from '../../../models/ascent-person';
import { testContext } from '../../../testing';

describe('relational/sql/ddl/alter-table', () => {
  const ctxs = testContext.contexts({
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

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
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
});