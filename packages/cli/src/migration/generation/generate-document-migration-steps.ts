import {DocumentCollectionSchema, MigrationStep} from '@daita/core';
import {generateDocumentCollectionMigrationSteps} from './generate-document-collection-migration-steps';
import {mergeList} from '../utils';

export function generateDocumentMigrationSteps(
  currentSchema: DocumentCollectionSchema,
  newSchema: DocumentCollectionSchema,
) {
  const steps: MigrationStep[] = [];

  mergeList(currentSchema.collections, newSchema.collections, {
    compare: (first, second) => first.name === second.name,
    add: collection => {
      steps.push({kind: 'add_collection', collection: collection.name});
      for (const field of collection.fields) {
        steps.push({
          kind: 'add_collection_field',
          collection: collection.name,
          type: field.type,
          fieldName: field.name,
          required: field.required,
          defaultValue: field.defaultValue,
        });
      }
    },
    remove: collection => {
      steps.push({kind: 'drop_collection', collection: collection.name});
    },
    merge: (currentCollection, newCollection) => {
      steps.push(...generateDocumentCollectionMigrationSteps(currentCollection, newCollection));
    },
  });

  return steps;
}
