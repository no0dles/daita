import { RelationalTableSchemaTable } from './relational-table-schema-table';

export interface RelationalTableSchema {
  tableNames: string[];
  table(name: string): RelationalTableSchemaTable | null;
  tables: RelationalTableSchemaTable[];
}
