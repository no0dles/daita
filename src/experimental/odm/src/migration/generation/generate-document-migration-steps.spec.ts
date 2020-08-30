// import {generateDocumentMigrationSteps} from './generate-document-migration-steps';
//
// describe('generate-document-migration-steps', () => {
//   it('steps for empty schema', () => {
//     const oldSchema = new DatabaseSchema({}, {});
//     const newSchema = new DatabaseSchema(
//       {
//         user: new DatabaseSchemaCollection('user', {
//           foo: {
//             name: 'foo',
//             type: 'string',
//             required: true,
//             defaultValue: 'abc',
//           },
//         }),
//       },
//       {},
//     );
//
//     const steps = generateDocumentMigrationSteps(oldSchema, newSchema);
//
//     expect(steps).toEqual([
//       {kind: 'add_collection', collection: 'user'},
//       {
//         kind: 'add_collection_field',
//         collection: 'user',
//         fieldName: 'foo',
//         type: 'string',
//         required: true,
//         defaultValue: 'abc',
//       },
//     ]);
//   });
//
//   it('steps for same schema', () => {
//     const schema = new DatabaseSchema(
//       {
//         user: new DatabaseSchemaCollection('user', {
//           foo: {
//             name: 'foo',
//             type: 'string',
//             required: true,
//             defaultValue: 'abc',
//           },
//         }),
//       },
//       {},
//     );
//     const steps = generateDocumentMigrationSteps(schema, schema);
//     expect(steps).toEqual([]);
//   });
// });
