import { DocumentCollectionSchema } from './document-collection-schema';
import { DocumentCollectionSchemaCollection } from './document-collection-schema-collection';
import { RelationalTableSchema } from './relational-table-schema';
import { RelationalTableSchemaTable } from './relational-table-schema-table';

export class DatabaseSchema<
  TSchemaCollection extends DocumentCollectionSchemaCollection = DocumentCollectionSchemaCollection,
  TRelationalTable extends RelationalTableSchemaTable = RelationalTableSchemaTable
> implements RelationalTableSchema, DocumentCollectionSchema {

  constructor(
    protected collectionMap: { [key: string]: TSchemaCollection } = {},
    protected tableMap: { [key: string]: TRelationalTable } = {},
  ) {}

  get tables(): TRelationalTable[] {
    return this.tableNames.map(name => this.tableMap[name]);
  }

  get collections(): TSchemaCollection[] {
    return this.collectionNames.map(name => this.collectionMap[name]);
  }

  get tableNames() {
    return Object.keys(this.tableMap);
  }

  get collectionNames() {
    return Object.keys(this.collectionMap);
  }

  collection(name: string): TSchemaCollection | null {
    return this.collectionMap[name] || null;
  }

  table(name: string): TRelationalTable | null {
    return this.tableMap[name] || null;
  }
}
