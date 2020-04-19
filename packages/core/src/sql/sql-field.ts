import { isKind } from '../utils/is-kind';

export interface SqlField {
  field: string;
}

export const isSqlField = (val: any): val is SqlField =>
  isKind<SqlField>(val, ['field']);
