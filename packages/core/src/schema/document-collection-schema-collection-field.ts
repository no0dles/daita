import {DocumentCollectionSchemaCollectionFieldType} from './document-collection-schema-collection-field-type';

export interface DocumentCollectionSchemaCollectionField {
  name: string;
  type: DocumentCollectionSchemaCollectionFieldType;
  required: boolean;
  defaultValue: any;
}
