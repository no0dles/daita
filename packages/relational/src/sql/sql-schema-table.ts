import { isKind } from '@daita/common';

export interface SqlSchemaTable {
  schema?: string;
  table: string;
}
export const isSqlSchemaTable = (val: any): val is SqlSchemaTable =>
  isKind<SqlSchemaTable>(val, ['table']);
