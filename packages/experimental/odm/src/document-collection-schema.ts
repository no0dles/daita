import { DocumentCollectionSchemaCollection } from './document-collection-schema-collection';

export interface DocumentCollectionSchema {
  collectionNames: string[];
  collection(name: string): DocumentCollectionSchemaCollection | null;
  collections: DocumentCollectionSchemaCollection[];
}
