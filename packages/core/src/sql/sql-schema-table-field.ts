import { isKind } from '../utils/is-kind';

export interface SqlSchemaTableField {
  field: string;
  table?: string;
  schema?: string;
}
export const isSqlSchemaTableField = (val: any): val is SqlSchemaTableField =>
  isKind<SqlSchemaTableField>(val, ['field']);
