import { getTestContext } from '@daita/testing';
import { schema } from './schema';
import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';
import { adapter as pgAdapter } from '@daita/pg-adapter';
import { Mountain } from './models/mountain';
import { Ascent } from './models/ascent';
import { Canton } from './models/canton';
import { json } from '@daita/relational';
import { Person } from './models/person';
import { AscentPerson } from './models/ascent-person';
import { getContext, MigrationTree } from '@daita/orm';
import { httpTestAdapter } from '@daita/testing';

export const testContext = getTestContext();
testContext.addAdapter(sqliteAdapter, { schema, memory: true });
testContext.addAdapter(pgAdapter, { schema, connectionString: 'postgres://postgres:postgres@localhost/mowntain' });
testContext.addAdapter(httpTestAdapter, {
  context: getContext(sqliteAdapter, { schema, memory: true }),
  schema,
  user: {
    roles: ['daita:migration:admin'],
  },
});

testContext.seed(Canton, {
  name: 'Bern',
  shortname: 'BE',
});
testContext.seed(Canton, {
  name: 'Valais',
  shortname: 'VS',
});
testContext.seed(Mountain, {
  name: 'Matterhorn',
  id: 'b65c271c-551b-11ec-bf63-0242ac130002',
  elevation: 4478,
  prominence: 1042.501,
  cantonShortname: 'VS',
});
testContext.seed(Mountain, {
  elevation: 4158,
  prominence: 695,
  name: 'Jungfrau',
  id: 'b04a54c9-6aa8-4e31-8c99-3db03342ea70',
  cantonShortname: 'BE',
  extra: json({ bool: true, text: 'foo', value: 10, date: new Date(2021, 0, 2) }),
});
testContext.seed(Ascent, {
  id: 'e2e6292c-551b-11ec-bf63-0242ac130002',
  date: new Date('2021-01-02T12:22:33.000Z'),
  mountainId: 'b65c271c-551b-11ec-bf63-0242ac130002',
});
testContext.seed(Person, {
  id: '571cb303-bd0f-40a3-8404-9395471d03e3',
  firstName: 'Edward',
  lastName: 'Whymper',
  active: false,
  birthday: new Date('1990-03-27T00:00:00.000Z'), // TODO 1840 does not work
});
testContext.seed(Person, {
  id: 'dafd9228-b626-4557-abc0-068855201a31',
  firstName: 'Lucy',
  lastName: 'Walker',
  active: true,
  birthday: new Date('1836-08-10T00:00:00.000Z'),
});
testContext.seed(AscentPerson, {
  personId: 'dafd9228-b626-4557-abc0-068855201a31',
  ascentId: 'e2e6292c-551b-11ec-bf63-0242ac130002',
});

export function getContexts(migrationTree: MigrationTree) {
  const testContext = getTestContext();
  testContext.addAdapter(sqliteAdapter, { migrationTree, memory: true });
  testContext.addAdapter(pgAdapter, {
    migrationTree,
    connectionString: 'postgres://postgres:postgres@localhost/mowntain',
  });

  return testContext.contexts();
}
