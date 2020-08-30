import { isSelectSql, SelectSql } from '../select-sql';
import { isExactKind } from '../../../common/utils';

export interface ExistsDescription {
  exists: SelectSql<any>;
}

export const isExistsDescription = (val: any): val is ExistsDescription =>
  isExactKind(val, ['exists']) && isSelectSql(val.exists);
