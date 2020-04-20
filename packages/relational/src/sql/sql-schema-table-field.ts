import { isKind } from '@daita/common';

export interface SqlSchemaTableField {
  field: string;
  table?: string;
  schema?: string;
}
export const isSqlSchemaTableField = (val: any): val is SqlSchemaTableField =>
  isKind<SqlSchemaTableField>(val, ['field']);
