import {DocumentCollectionSchemaCollection, MigrationStep} from '@daita/core';
import {mergeList} from '../utils';

export function generateDocumentCollectionMigrationSteps(
  currentCollection: DocumentCollectionSchemaCollection,
  newCollection: DocumentCollectionSchemaCollection,
) {
  const steps: MigrationStep[] = [];

  mergeList(currentCollection.fields, newCollection.fields, {
    compare: (first, second) => first.name === second.name,
    add: field => {
      steps.push({
        kind: 'add_collection_field',
        collection: newCollection.name,
        fieldName: field.name,
        defaultValue: field.defaultValue,
        required: field.required,
        type: field.type,
      });
    },
    remove: field => {
      steps.push({
        kind: 'drop_collection_field',
        fieldName: field.name,
        collection: newCollection.name,
      });
    },
    merge: (currentField, newField) => {
      if (newField.type !== currentField.type) {
        steps.push({
          kind: 'drop_collection_field',
          collection: newCollection.name,
          fieldName: currentField.name,
        });
        steps.push({
          kind: 'add_collection_field',
          fieldName: currentField.name,
          type: newField.type,
          collection: newCollection.name,
          required: newField.required,
          defaultValue: newField.defaultValue,
        });
      } else if (
        newField.required !== currentField.required ||
        newField.defaultValue !== currentField.defaultValue
      ) {
        steps.push({
          kind: 'modify_collection_field',
          required: newField.required,
          defaultValue: newField.defaultValue,
          collection: newCollection.name,

          fieldName: currentField.name,
        });
      }
    },
  });

  return steps;
}
