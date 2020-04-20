import { isKind } from '@daita/common';

export interface SqlSelectDistinct {
  distinct: true;
}

export const isSqlSelectDistinct = (val: any): val is SqlSelectDistinct =>
  isKind<SqlSelectDistinct>(val, ['distinct']);
