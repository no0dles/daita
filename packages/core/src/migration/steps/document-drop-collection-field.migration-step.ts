export interface DropCollectionFieldMigrationStep {
  kind: 'drop_collection_field';
  collection: string;
  fieldName: string;
}
