import { table } from '@daita/relational';
import { Ascent } from '../../../models/ascent';
import { AscentPerson } from '../../../models/ascent-person';
import { testContext } from '../../../testing';
import { Person } from '../../../models/person';

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

    it('should add foreign key with constraint name', async () => {
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
    });

    it('should add foreign key', async () => {
      await ctx.exec({
        alterTable: table(AscentPerson),
        add: {
          foreignKey: 'personId',
          references: {
            table: table(Person),
            primaryKeys: 'id',
          },
        },
      });
    });

    // it('should add foreign key with multiple keys', () => {
    //   expectedSql(
    //     {
    //       alterTable: table('user'),
    //       add: {
    //         foreignKey: ['createdFromId', 'secondId'],
    //         references: {
    //           table: table('user'),
    //           primaryKeys: ['id', 'secondId'],
    //         },
    //       },
    //     },
    //     'ALTER TABLE "user" ADD FOREIGN KEY ("createdFromId", "secondId") REFERENCES "user" ("id", "secondId")',
    //   );
    // });
  });
});
