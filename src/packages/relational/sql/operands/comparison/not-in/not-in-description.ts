import { isExactKind } from '../../../../../common/utils/is-exact-kind';
import { SelectSql } from '../../../dml/select/select-sql';

export interface NotInDescription<T> {
  notIn: { field: T; values: T[] | SelectSql<T> };
}

export const isNotInDescription = (val: any): val is NotInDescription<any> =>
  isExactKind<NotInDescription<any>>(val, ['notIn']);
