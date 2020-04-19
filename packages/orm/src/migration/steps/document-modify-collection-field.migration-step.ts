export interface ModifyCollectionFieldMigrationStep {
  kind: 'modify_collection_field';
  collection: string;
  fieldName: string;
  required: boolean;
  defaultValue: any;
}
