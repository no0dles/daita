// else if (migrationStep.kind === 'add_collection_field') {
//   return {
//     kind: 'add_collection_field',
//     collection: getStringValue(step, 'collection'),
//     fieldName: getStringValue(step, 'fieldName'),
//     type: getStringValue(step, 'type') as DocumentCollectionSchemaCollectionFieldType,
//     required: getBooleanValue(step, 'required'),
//     defaultValue: getAnyValue(step, 'defaultValue'),
//   }
// } else if (migrationStep.kind === 'add_collection') {
//   return {kind: 'add_collection', collection: getStringValue(step, 'collection')};
// } else if (migrationStep.kind === 'drop_collection') {
//   return {kind: 'drop_collection', collection: getStringValue(step, 'collection')};
// } else if (migrationStep.kind === 'modify_collection_field') {
//   return {
//     kind: 'modify_collection_field',
//     collection: getStringValue(step, 'collection'),
//     fieldName: getStringValue(step, 'fieldName'),
//     required: getBooleanValue(step, 'required'),
//     defaultValue: getAnyValue(step, 'defaultValue'),
//   }
// } else if (migrationStep.kind === 'drop_collection_field') {
//   return {
//     kind: 'drop_collection_field',
//     collection: getStringValue(step, 'collection'),
//     fieldName: getStringValue(step, 'fieldName'),
//   }
// } else if (migrationStep.kind === 'rename_collection_field') {
//   return {
//     kind: 'rename_collection_field',
//     collection: getStringValue(step, 'collection'),
//     newFieldName: getStringValue(step, 'newFieldName'),
//     oldFieldName: getStringValue(step, 'oldFieldName'),
//   }
// }
