// import { table } from '@daita/relational';
// import { CreateTableColumn, CreateTableSql } from '@daita/relational';
// import { Client } from '../../packages/relational/client/client';
// import { InsertSql } from '../../packages/relational/sql/dml/insert/insert-sql';
// import { Person } from '../../examples/mowntain/models/person';
// import { randomNumber, randomString, randomUuid } from '../../packages/common/utils/random-string';
// import { Canton } from '../../examples/mowntain/models/canton';
// import { Mountain } from '../../examples/mowntain/models/mountain';
// import { Ascent } from '../../examples/mowntain/models/ascent';
// import { AscentPerson } from '../../examples/mowntain/models/ascent-person';
// import { Constructable } from '../../packages/common/types/constructable';
// import { json } from '../../packages/relational/types/json/json';
//
// type CreateTestSchemaSql = CreateTableSql;
//
// export async function createTestSchema(client: Client<CreateTestSchemaSql>) {
//   await createPersonTable(client);
//   await createCantonTable(client);
//   await createMountainTable(client);
//   await createAscentTable(client);
//   await createAscentPersonTable(client);
// }
//
// export function createPersonTable(client: Client<CreateTestSchemaSql>) {
//   return createTable(client, Person, [
//     { type: 'uuid', primaryKey: true, notNull: true, name: 'id' },
//     { type: 'string', primaryKey: false, notNull: true, name: 'firstName' },
//     { type: 'string', primaryKey: false, notNull: true, name: 'lastName' },
//     { type: 'date', primaryKey: false, notNull: false, name: 'birthday' },
//     { type: 'boolean', primaryKey: false, notNull: true, name: 'active' },
//   ]);
// }
// export function createCantonTable(client: Client<CreateTestSchemaSql>) {
//   return createTable(client, Canton, [
//     { type: 'string', primaryKey: true, notNull: true, name: 'shortname' },
//     { type: 'string', primaryKey: false, notNull: true, name: 'name' },
//     { type: 'string[]', primaryKey: false, notNull: true, name: 'languages' },
//   ]);
// }
// export function createMountainTable(client: Client<CreateTestSchemaSql>) {
//   return createTable(client, Mountain, [
//     { type: 'uuid', primaryKey: true, notNull: true, name: 'id' },
//     { type: 'string', primaryKey: false, notNull: true, name: 'name' },
//     { type: 'string', primaryKey: false, notNull: true, name: 'cantonShortname' },
//     { type: 'number', primaryKey: false, notNull: true, name: 'elevation' },
//     { type: 'number', primaryKey: false, notNull: true, name: 'prominence' },
//     { type: 'number', primaryKey: false, notNull: false, name: 'ascents' },
//     { type: 'json', primaryKey: false, notNull: false, name: 'extra' },
//   ]);
// }
// export function createAscentTable(client: Client<CreateTestSchemaSql>) {
//   return createTable(client, Ascent, [
//     { type: 'uuid', primaryKey: true, notNull: true, name: 'id' },
//     { type: 'uuid', primaryKey: false, notNull: true, name: 'mountainId' },
//     { type: 'date', primaryKey: false, notNull: true, name: 'date' },
//   ]);
// }
// export function createAscentPersonTable(client: Client<CreateTestSchemaSql>) {
//   return createTable(client, AscentPerson, [
//     { type: 'uuid', primaryKey: true, notNull: true, name: 'ascentId' },
//     { type: 'uuid', primaryKey: true, notNull: true, name: 'personId' },
//   ]);
// }
//
// export async function createPerson(client: Client<InsertSql<any>>, person: Partial<Person>) {
//   await client.insert({
//     into: table(Person),
//     insert: {
//       id: person.id || randomUuid(),
//       firstName: person.firstName || randomString(6),
//       lastName: person.lastName || randomString(8),
//       birthday: person.birthday,
//       active: person.active ?? true,
//     },
//   });
// }
// export async function createMountain(client: Client<InsertSql<any>>, mountain: Partial<Mountain>) {
//   await client.insert({
//     into: table(Mountain),
//     insert: {
//       id: mountain.id || randomUuid(),
//       name: mountain.name || randomString(7),
//       cantonShortname: mountain.cantonShortname || randomString(2),
//       elevation: mountain.elevation || randomNumber(0, 5000),
//       prominence: mountain.prominence || randomNumber(0, 5000),
//       extra:
//         mountain.extra ||
//         json({
//           foo: 'bar',
//         }),
//     },
//   });
// }
//
// export async function createTable(
//   client: Client<CreateTestSchemaSql>,
//   type: Constructable<any>,
//   columns: CreateTableColumn[],
// ) {
//   await client.exec({
//     createTable: table(type),
//     columns: columns,
//   });
// }
