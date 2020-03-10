import {isKind} from '../utils/is-kind';

export interface SqlSchemaTable {
  schema?: string;
  table: string;
}
export const isSqlSchemaTable = (val: any): val is SqlSchemaTable => isKind<SqlSchemaTable>(val, ['table']);