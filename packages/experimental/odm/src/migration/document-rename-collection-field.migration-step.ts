export interface RenameCollectionFieldMigrationStep {
  kind: 'rename_collection_field';
  collection: string;
  oldFieldName: string;
  newFieldName: string;
}
