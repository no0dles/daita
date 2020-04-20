import { SqlTable } from '../sql-table';
import { SqlExpression } from '../expression';
import { isKind } from '@daita/common';

export interface SqlDelete {
  delete: SqlTable;
  where?: SqlExpression | null;
}

export const isSqlDelete = (val: any): val is SqlDelete =>
  isKind<SqlDelete>(val, ['delete']);
