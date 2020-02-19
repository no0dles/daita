import { DocumentCollectionSchemaCollectionFieldType } from '../../schema';

export interface AddCollectionFieldMigrationStep {
  kind: 'add_collection_field',
  collection: string;
  fieldName: string;
  type: DocumentCollectionSchemaCollectionFieldType;
  required: boolean;
  defaultValue: any;
}