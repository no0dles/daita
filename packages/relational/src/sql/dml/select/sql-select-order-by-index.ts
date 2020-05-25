import { SqlOrderDirection } from './sql-order-direction';
import { isKind } from '@daita/common';

export interface SqlSelectOrderByIndex {
  index: number;
  direction?: SqlOrderDirection;
}
export const isSqlSelectOrderByIndex = (
  val: any,
): val is SqlSelectOrderByIndex =>
  isKind<SqlSelectOrderByIndex>(val, ['index']);
