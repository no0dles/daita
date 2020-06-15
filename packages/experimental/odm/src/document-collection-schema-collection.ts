import { DocumentCollectionSchemaCollectionField } from './document-collection-schema-collection-field';

export interface DocumentCollectionSchemaCollection {
  name: string;
  fieldNames: string[];
  field(name: string): DocumentCollectionSchemaCollectionField | null;
  fields: DocumentCollectionSchemaCollectionField[];
}
