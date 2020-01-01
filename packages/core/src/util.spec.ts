// import {assert} from 'chai';
// import {DataService} from './data/service';
// import {Migration} from './migration/migration';
// import {MigrationList} from './migration/migration-list';
// import {AddCollectionFieldMigrationStep} from './migration/steps/document-add-collection-field.migration-step';
// import {AddCollectionMigrationStep} from './migration/steps/document-add-collection.migration-step';
// import {RenameCollectionFieldMigrationStep} from './migration/steps/document-rename-collection-field.migration-step';
// import {MongoDataAdapter} from './mongodb';
//
// const migrationA = new Migration('a.ts','a', [
//   new AddCollectionMigrationStep('user'),
//   new AddCollectionFieldMigrationStep('user', 'name', 'string', true, ''),
// ]);
//
// const migrationB = new Migration('b.ts', 'b', [
//   new AddCollectionFieldMigrationStep('user', 'email', 'string', true, ''),
//   new RenameCollectionFieldMigrationStep('user', 'name', 'username'),
// ], migrationA);
//
// const migrationC = new Migration('c.ts','c', [
//   new AddCollectionMigrationStep('role'),
//   new AddCollectionFieldMigrationStep('role', 'name', 'string', true, ''),
// ], migrationB);
//
// const migrationList = new MigrationList([
//   migrationA,
//   migrationB,
//   migrationC,
// ]);
//
// describe('util', () => {
//   it('schema', () => {
//     const schema = migrationList.getSchema('a');
//     const collection = schema.collection('user');
//     assert.isNotNull(collection);
//     if(!collection)
//       return;
//
//     const field = collection
//       .field('name');
//
//     if(!field) {
//       throw new Error('missing field');
//     }
//     assert.equal(field.name, 'name');
//   });
//
//   it("create from c and get from a", async () => {
//     const adapter = new MongoDataAdapter("mongodb://localhost/datam_test");
//
//     const schemaA = migrationList.getSchema('a');
//     const schemaB = migrationList.getSchema('b');
//     const schemaC = migrationList.getSchema('c');
//
//     const svcA = new DataService(adapter, schemaA);
//     const svcB = new DataService(adapter, schemaB);
//     const svcC = new DataService(adapter, schemaC);
//
//     await svcB.delete("user", "2");
//
//     await svcC.create(
//       "user",
//       { id: '2', username: "pascal", email: "pascal@bertschi" }
//     );
//     const modelA = await svcA.get("user", "2");
//     const modelC = await svcC.get("user", "2");
//     assert.deepEqual(modelA, { name: "pascal" });
//     assert.deepEqual(modelC, { username: "pascal", email: "pascal@bertschi" });
//   });
//
// });
