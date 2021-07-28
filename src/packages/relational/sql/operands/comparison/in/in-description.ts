import { isExactKind } from '../../../../../common/utils/is-exact-kind';
import { SelectSql } from '../../../dml/select/select-sql';

export interface InDescription<T> {
  in: {
    field: T;
    values: T[] | SelectSql<T>;
  };
}

export const isInDescription = (val: any): val is InDescription<any> => isExactKind<InDescription<any>>(val, ['in']);
