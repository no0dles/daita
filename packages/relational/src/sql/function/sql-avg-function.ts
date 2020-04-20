import { isKind } from '@daita/common';

export interface SqlAvgFunction {
  avg: { schema?: string; table?: string; field: string };
}

export const isSqlAvgFunction = (val: any): val is SqlAvgFunction =>
  isKind<SqlAvgFunction>(val, ['avg']);
