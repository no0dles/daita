import { isKind } from '@daita/common';

export interface SqlField {
  field: string;
}

export const isSqlField = (val: any): val is SqlField =>
  isKind<SqlField>(val, ['field']);
