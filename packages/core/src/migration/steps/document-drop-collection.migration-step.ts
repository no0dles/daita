export interface DropCollectionMigrationStep {
  kind: 'drop_collection';
  collection: string;
}
