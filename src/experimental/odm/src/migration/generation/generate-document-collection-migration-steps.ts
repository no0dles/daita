// import {merge} from '@daita/common';
//
// export function generateDocumentCollectionMigrationSteps(
//   currentCollection: DocumentCollectionSchemaCollection,
//   newCollection: DocumentCollectionSchemaCollection,
// ) {
//   const steps: MigrationStep[] = [];
//
//   const mergedFields = merge(currentCollection.fields, newCollection.fields, (first, second) => first.name === second.name);
//   for(const addedField of mergedFields.added) {
//     steps.push({
//       kind: 'add_collection_field',
//       collection: newCollection.name,
//       fieldName: addedField.name,
//       defaultValue: addedField.defaultValue,
//       required: addedField.required,
//       type: addedField.type,
//     });
//   }
//   for(const deletedField of mergedFields.removed) {
//     steps.push({
//       kind: 'drop_collection_field',
//       fieldName: deletedField.name,
//       collection: newCollection.name,
//     });
//   }
//
//   for(const mergedField of mergedFields.merge) {
//     if (newField.type !== currentField.type) {
//       steps.push({
//         kind: 'drop_collection_field',
//         collection: newCollection.name,
//         fieldName: currentField.name,
//       });
//       steps.push({
//         kind: 'add_collection_field',
//         fieldName: currentField.name,
//         type: newField.type,
//         collection: newCollection.name,
//         required: newField.required,
//         defaultValue: newField.defaultValue,
//       });
//     } else if (
//       newField.required !== currentField.required ||
//       newField.defaultValue !== currentField.defaultValue
//     ) {
//       steps.push({
//         kind: 'modify_collection_field',
//         required: newField.required,
//         defaultValue: newField.defaultValue,
//         collection: newCollection.name,
//
//         fieldName: currentField.name,
//       });
//     }
//   }
//
//   return steps;
// }
