import { RelationalTableSchemaTable } from './relational-table-schema-table';
import { TablePermission } from "@daita/core";

export interface RelationalTableSchema {
  tableNames: string[];
  table(name: string): RelationalTableSchemaTable | null;
  tables: RelationalTableSchemaTable[];
  tablePermissions(name: string): TablePermission<any>[];
}
