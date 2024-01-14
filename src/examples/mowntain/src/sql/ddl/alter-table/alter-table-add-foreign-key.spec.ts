import { RelationalAdapter, table } from '@daita/relational';
import { Ascent } from '../../../models/ascent';
import { AscentPerson } from '../../../models/ascent-person';
import { Person } from '../../../models/person';
import { seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/ddl/alter-table', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
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
