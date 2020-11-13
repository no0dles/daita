import { table } from '../../keyword/table/table';
import { dataClients } from '../../../../../testing/relational/adapters';
import { ClientTestContext } from '../../../../../testing/relational/adapter/client-test-context';
import {
  createAscentPersonTable,
  createAscentTable,
  createPerson,
  createPersonTable,
} from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../testing/schema/person';
import { AscentPerson } from '../../../../../testing/schema/ascent-person';
import { Ascent } from '../../../../../testing/schema/ascent';

describe('relational/sql/ddl/alter-table', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
      await createPersonTable(ctx.client);
      await createAscentTable(ctx.client);
      await createAscentPersonTable(ctx.client);
    });

    afterAll(() => ctx.close());

    it('should drop column', async () => {
      await ctx.client.exec({
        alterTable: table(Person),
        drop: {
          column: 'firstName',
        },
      });
    });

    it('should add column', async () => {
      await ctx.client.exec({
        alterTable: table(Person),
        add: {
          column: 'firstName2',
          type: 'string',
        },
      });
    });

    it('should add foreign key', async () => {
      await ctx.client.exec({
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

    it('should add foreign key with constraint name', async () => {
      await ctx.client.exec({
        alterTable: table(AscentPerson),
        add: {
          foreignKey: 'ascentId',
          constraint: 'ascent',
          references: {
            table: table(Ascent),
            primaryKeys: 'id',
          },
        },
      });
    });

    it('should drop foreign key with constraint name', async () => {
      await ctx.client.exec({
        alterTable: table(AscentPerson),
        drop: {
          constraint: 'ascent',
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
