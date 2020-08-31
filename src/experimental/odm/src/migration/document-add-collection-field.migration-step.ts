import { DocumentCollectionSchemaCollectionFieldType } from '../document-collection-schema-collection-field-type';

export interface AddCollectionFieldMigrationStep {
  kind: 'add_collection_field';
  collection: string;
  fieldName: string;
  type: DocumentCollectionSchemaCollectionFieldType;
  required: boolean;
  defaultValue: any;
}
