import { RelationalTableSchemaTable } from './relational-table-schema-table';
import {Permission} from '../permission';

export interface RelationalTableSchema {
  tableNames: string[];
  table(name: string): RelationalTableSchemaTable | null;
  tables: RelationalTableSchemaTable[];
  tablePermissions(name: string): Permission<any>[];
}
