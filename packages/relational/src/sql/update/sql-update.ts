import { SqlUpdateSet } from './sql-update-set';
import { SqlTable } from '../sql-table';
import { SqlExpression } from '../expression';
import { isKind } from '@daita/common';

export interface SqlUpdate {
  update: SqlTable;
  set: {
    [key: string]: SqlUpdateSet;
  };
  where?: SqlExpression | null;
}

export const isSqlUpdate = (val: any): val is SqlUpdate =>
  isKind<SqlUpdate>(val, ['update', 'set']);
