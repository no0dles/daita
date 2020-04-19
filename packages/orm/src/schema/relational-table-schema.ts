import { RelationalTableSchemaTable } from './relational-table-schema-table';
import {TablePermission} from '../permission';

export interface RelationalTableSchema {
  tableNames: string[];
  table(name: string): RelationalTableSchemaTable | null;
  tables: RelationalTableSchemaTable[];
  tablePermissions(name: string): TablePermission<any>[];
}
